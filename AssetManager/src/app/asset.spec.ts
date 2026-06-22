import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AssetService {
  // 🔗 Points directly to your C# Assets Controller route!
  private apiUrl = 'https://asset-manager-production-fe86.up.railway.app/api/assets'; 

  constructor(private http: HttpClient) { }

  getAssets(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getSummary(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/summary`);
  }
}