import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard';
import { EmployeeListComponent } from './components/employee-list/employee-list';
import { AssetListComponent } from './components/asset-list/asset-list';
import { LoginComponent } from './components/login/login.component'; // We will create this next!
import { authGuard } from './guards/auth.guard'; // We will create this next!

export const routes: Routes = [
  // 🔑 Change default redirect to point to login first
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  
  // 🔒 Guarded route paths
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'employees', component: EmployeeListComponent, canActivate: [authGuard] },
  { path: 'assets', component: AssetListComponent, canActivate: [authGuard] },
  
  // Catch-all fallback redirecting to login
  { path: '**', redirectTo: 'login' }
];