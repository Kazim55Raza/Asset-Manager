import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  credentials = { username: '', password: '' };
  isLoading = false;
  errorMessage = '';

  constructor(private router: Router) {}

  onLogin() {
    if (!this.credentials.username || !this.credentials.password) return;
    
    this.isLoading = true;
    this.errorMessage = '';

    // Mocking an API delay check for 1.5 seconds so you can see your beautiful loader!
    setTimeout(() => {
      if (this.credentials.username === 'admin' && this.credentials.password === 'admin123') {
        localStorage.setItem('token', 'mock-jwt-token-xyz'); // Set auth token
        this.isLoading = false;
        this.router.navigate(['/dashboard']); // Route inside!
      } else {
        this.isLoading = false;
        this.errorMessage = 'Invalid username or password credentials.';
      }
    }, 1500);
  }
}