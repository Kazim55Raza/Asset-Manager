import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssetService } from '../../asset.spec';
import { EmployeeService } from '../../employee.spec';
import { forkJoin, Observable, catchError, of } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit {
  dashboardSummary$!: Observable<any>;

  constructor(
    private assetService: AssetService,
    private employeeService: EmployeeService
  ) {}

  ngOnInit(): void {
    this.dashboardSummary$ = forkJoin({
      // 🛡️ Safeguard Assets Stream: Fallback to mock zeros if your API fails or changes shape
      assetDto: this.assetService.getSummary().pipe(
        catchError(err => { 
          console.error('Asset API failed or returned wrong shape:', err); 
          return of({ totalAssets: 0, unassignedAssets: 0, totalAssetsValue: 0, assignedAssets: 0 }); 
        })
      ),
      // 🛡️ Safeguard Employees Stream: Fallback to an empty array
      employeePayload: this.employeeService.getEmployees().pipe(
        catchError(err => { 
          console.error('Employee API failed:', err); 
          return of([]); 
        })
      )
    });
  }
}