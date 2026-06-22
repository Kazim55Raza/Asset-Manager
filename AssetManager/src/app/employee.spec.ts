import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  // 🔗 Points directly to your C# Controller route!
  private apiUrl = 'https://asset-manager-production-fe86.up.railway.app/api/employees'; 

  constructor(private http: HttpClient) { }

  // Fetch all employees from our backend
  getEmployees(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getEmployeeSummary(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/summary`);
  }

  addEmployee(employeeData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, employeeData);
  }

  updateEmployee(id: number, employeeData: any): Observable<any> {
  return this.http.put<any>(`${this.apiUrl}/${id}`, employeeData);
}

  deleteEmployee(id: number): Observable<any> {
  return this.http.delete<any>(`${this.apiUrl}/${id}`);
}
}