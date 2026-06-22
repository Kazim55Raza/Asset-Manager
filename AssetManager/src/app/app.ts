import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent {
  showNavbar = false;

  constructor(private router: Router) {
    // 🔄 Listen to router changes to dynamically toggle header presence
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      // Hide the navbar strictly on the login route screen
      this.showNavbar = !event.urlAfterRedirects.includes('/login');
    });
  }

  logout() {
    localStorage.removeItem('token'); // Clear auth token session
    this.router.navigate(['/login']); // Redirect straight back to login page
  }
}