import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard';
import { EmployeeListComponent } from './components/employee-list/employee-list';
import { AssetListComponent } from './components/asset-list/asset-list'; // 👈 1. Import it!

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'employees', component: EmployeeListComponent },
  { path: 'assets', component: AssetListComponent } // 👈 2. Add the route pathway!
];