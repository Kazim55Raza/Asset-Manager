import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive], // 👈 This activates your app.html links!
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent {

  constructor(private router: Router) {}

  // Checks if user token is active
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  logout() {
    localStorage.removeItem('token'); // Kill session
    this.router.navigate(['/login']); // Send back to login gate
  }
} // 👈 Clean and empty because sub-components handle the data now!