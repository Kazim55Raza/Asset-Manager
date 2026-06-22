import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  
  // Simple check for an authentication token stored inside the browser
  const isAuthenticated = !!localStorage.getItem('token'); 

  if (isAuthenticated) {
    return true; // Let them through!
  } else {
    router.navigate(['/login']); // Kick them back to login page
    return false;
  }
};