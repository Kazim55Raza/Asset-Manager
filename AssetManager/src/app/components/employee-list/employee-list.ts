import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeService } from '../../employee.spec';
import { Observable, BehaviorSubject, switchMap, map, catchError, of } from 'rxjs';
import { ReactiveFormsModule, FormGroup, FormControl, Validators, FormsModule } from '@angular/forms'; // 👈 Form Imports

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './employee-list.html',
  styleUrl: './employee-list.css'
})
export class EmployeeListComponent implements OnInit {
  employeesList$!: Observable<any[]>;
  private refresh$ = new BehaviorSubject<void>(undefined);
toastMessage: string | null = null;
editingEmployeeId: number | null = null;
searchQuery: string = '';

   employeeForm = new FormGroup({
    fullName: new FormControl('', [Validators.required, Validators.minLength(3)]),
    email: new FormControl('', [Validators.required, Validators.email])
  });

  constructor(private employeeService: EmployeeService,
    private cdr: ChangeDetectorRef
  ) {}

  // ngOnInit(): void {
  //   // Whenever refresh$ triggers, fetch a fresh list from the backend
  //   this.employeesList$ = this.refresh$.pipe(
  //     switchMap(() => this.employeeService.getEmployees()),
  //     map((response: any) => response.data || response.items || response)
  //   );
  // }
  ngOnInit(): void {

    this.employeesList$ = this.refresh$.pipe(
      switchMap(() => this.employeeService.getEmployees().pipe(
        // 🛡️ Catch errors locally inside the HTTP stream so the main table stream doesn't die
        catchError((err) => {
          console.error('API Error caught:', err);
          this.toastMessage = '❌ Failed to fetch latest database rows.';
          setTimeout(() => this.toastMessage = null, 4000);
          return of([]); // Return an empty array placeholder on failure
        })
      )),
      
    );
  }

  onEdit(emp: any): void {
    this.editingEmployeeId = emp.Id; // Marks mode as "Editing"
    this.employeeForm.setValue({
      fullName: emp.FullName,
      email: emp.Email
    });
  }

  // ❌ Cancel out of edit mode safely
  cancelEdit(): void {
    this.editingEmployeeId = null;
    this.employeeForm.reset();
  }


  onDelete(id: number): void {
  if (confirm('⚠️ Are you sure you want to permanently delete this employee record?')) {
    this.employeeService.deleteEmployee(id).subscribe({
      next: () => {
        this.toastMessage = '🗑️ Employee record deleted successfully!';
        
        // If we were editing this specific employee when deleted, reset the form safely
        if (this.editingEmployeeId === id) {
          this.cancelEdit();
        }
        
        this.refresh$.next(); // 🚀 Force the table stream to reload live!
        setTimeout(() => {
            this.toastMessage = null;
            this.cdr.detectChanges(); // 🚀 Force UI to clear the banner instantly!
          }, 3000);
      },
      error: (err) => {
        this.toastMessage = '❌ Failed to delete record. It might be linked to active hardware.';
        setTimeout(() => this.toastMessage = null, 4000);
        console.error(err);
      }
    });
  }
}
  onSubmit(): void {
  if (this.employeeForm.valid) {

    const formValue = this.employeeForm.value;
      
      // 💡 Split full name into First/Last name pieces just in case your C# model expects them!
      const nameParts = (formValue.fullName || '').trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      const payload = {
      id: this.editingEmployeeId || 0,
      Id: this.editingEmployeeId || 0,
      firstName: firstName,
      FirstName: firstName,
      lastName: lastName,
      LastName: lastName,
      fullName: formValue.fullName,
      FullName: formValue.fullName,
      email: formValue.email,
      Email: formValue.email
    };

      if (this.editingEmployeeId) {
        // 🛠️ RUN UPDATE LOGIC
        this.employeeService.updateEmployee(this.editingEmployeeId, payload).subscribe({
          next: () => {
            this.toastMessage = '✏️ Employee record updated successfully!';
            this.cancelEdit();
            this.refresh$.next();
            setTimeout(() => {
            this.toastMessage = null;
            this.cdr.detectChanges(); // 🚀 Force UI to clear the banner instantly!
          }, 3000);
          },
          error: (err) => console.error(err)
        });
      } else {
this.employeeService.addEmployee(payload).subscribe({
      next: () => {
        // 🔔 Native browser popup window alert
       this.toastMessage = '🎉 Employee record has been created successfully!'; 

        
        this.employeeForm.reset(); 
        this.refresh$.next(); 
        setTimeout(() => {
            this.toastMessage = null;
            this.cdr.detectChanges(); // 🚀 Force UI to clear the banner instantly!
          }, 3000);
      },
      error: (err) => {
        this.toastMessage = '❌ Server submission error. Check terminal details.';
        setTimeout(() => this.toastMessage = null, 4000);
        console.error('Submission Failed:', err);
      }
    });

      }

      

    
  }
}
getFilteredEmployees(employees: any[] | null): any[] {
    if (!employees) return [];
    if (!this.searchQuery.trim()) return employees;

    const query = this.searchQuery.toLowerCase().trim();

    return employees.filter(emp => {
      const name = (emp.FullName || emp.fullName || emp.Name || emp.name || '').toLowerCase();
      const department = (emp.Department || emp.department || '').toLowerCase();

      return name.includes(query) || department.includes(query);
    });
  }

}
