import { Component, ElementRef, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssetService } from '../../asset.spec';
import { EmployeeService } from '../../employee.spec';
import { forkJoin, Observable, catchError, of, Subscription } from 'rxjs';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit, OnDestroy {
  dashboardSummary$!: Observable<any>;
  private summarySub!: Subscription;
  private chartInstance: Chart | null = null;

  @ViewChild('analyticsChart') analyticsChart!: ElementRef<HTMLCanvasElement>;
  
  constructor(
    private assetService: AssetService,
    private employeeService: EmployeeService
  ) {}

  ngOnInit(): void {
    // 🔗 Set up the combined structural data stream
    this.dashboardSummary$ = forkJoin({
      assetDto: this.assetService.getSummary().pipe(
        catchError(err => { 
          console.error('Asset API failed or returned wrong shape:', err); 
          return of({ TotalAssetsCount: 0, unAssignedAssetCount: 0, TotalAssetsValue: 0, AssignedAssetCount: 0 }); 
        })
      ),
      employeePayload: this.employeeService.getEmployees().pipe(
        catchError(err => { 
          console.error('Employee API failed:', err); 
          return of([]); 
        })
      )
    });

    // 📊 Subscribe to the unified forkJoin stream to automatically render the analytics data
    this.summarySub = this.dashboardSummary$.subscribe({
      next: (data) => {
        if (data && data.assetDto) {
          // Wrap inside a brief timeout so Angular has time to initialize the DOM canvas element
          setTimeout(() => {
            this.buildChart(
              data.assetDto.AssignedAssetCount ?? 0,
              data.assetDto.unAssignedAssetCount ?? 0
            );
          }, 50);
        }
      }
    });
  }

  buildChart(assigned: number, unassigned: number): void {
    // Clean up old canvas instances to prevent overlapping charts on hot-reloads
    if (this.chartInstance) {
      this.chartInstance.destroy();
    }

    const ctx = this.analyticsChart.nativeElement.getContext('2d');
    if (!ctx) return;

    this.chartInstance = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Assigned Assets', 'Unassigned Reserves'],
        datasets: [{
          data: [assigned, unassigned],
          backgroundColor: ['#10b981', '#f59e0b'], // Emerald-500 and Amber-500 matching your theme
          borderColor: '#1e293b',          // Matches your Slate-800 container borders
          borderWidth: 3,
          hoverOffset: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
             color: '#94a3b8', 
  // 🔑 Adding "as any" shuts down the strict type checker so it compiles clean!
              font: { family: 'sans-serif', size: 12, weight: '500' } as any, 
              padding: 16
              }
          }
        },
        cutout: '75%' // Modern, ultra-clean thin ring design layout
      }
    });
  }

  // 🧹 Ensure subscriptions and chart objects are discarded cleanly on page exit
  ngOnDestroy(): void {
    if (this.summarySub) this.summarySub.unsubscribe();
    if (this.chartInstance) this.chartInstance.destroy();
  }
}