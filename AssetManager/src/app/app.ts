import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive], // 👈 This activates your app.html links!
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent {} // 👈 Clean and empty because sub-components handle the data now!