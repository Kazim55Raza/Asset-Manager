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
  
  // Keep temporary variables to hold counts until the canvas renders
  private assignedCount = 0;
  private unassignedCount = 0;

  // 🔑 CHANGE THIS: Use a Setter property instead of a direct variable.
  // This function fires the exact millisecond the canvas appears inside the *ngIf block!
  @ViewChild('analyticsChart') set academyChart(content: ElementRef<HTMLCanvasElement>) {
    if (content && content.nativeElement) {
      this.buildChart(content.nativeElement, this.assignedCount, this.unassignedCount);
    }
  }
  
  constructor(
    private assetService: AssetService,
    private employeeService: EmployeeService
  ) {}

  ngOnInit(): void {
    this.dashboardSummary$ = forkJoin({
      assetDto: this.assetService.getSummary().pipe(
        catchError(err => { 
          console.error('Asset API failed:', err); 
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

    // Capture counts into memory when API data responds
    this.summarySub = this.dashboardSummary$.subscribe({
      next: (data) => {
        if (data && data.assetDto) {
          this.assignedCount = data.assetDto.AssignedAssetCount ?? 0;
          this.unassignedCount = data.assetDto.unAssignedAssetCount ?? 0;
        }
      }
    });
  }

  // Updated to receive the direct native element parameter safely
  buildChart(canvasElement: HTMLCanvasElement, assigned: number, unassigned: number): void {
    if (this.chartInstance) {
      this.chartInstance.destroy();
    }

    const ctx = canvasElement.getContext('2d');
    if (!ctx) return;

    this.chartInstance = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Assigned Assets', 'Unassigned Reserves'],
        datasets: [{
          data: [assigned, unassigned],
          backgroundColor: ['#10b981', '#f59e0b'],
          borderColor: '#1e293b',          
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
              font: { family: 'sans-serif', size: 12, weight: '500' } as any,
              padding: 16
            }
          }
        },
        cutout: '75%' 
      }
    });
  }

  ngOnDestroy(): void {
    if (this.summarySub) this.summarySub.unsubscribe();
    if (this.chartInstance) this.chartInstance.destroy();
  }
}