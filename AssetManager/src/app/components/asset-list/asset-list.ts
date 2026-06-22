import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AssetService } from '../../asset.spec';
import { EmployeeService } from '../../employee.spec';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-asset-list',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './asset-list.html',
  styleUrl: './asset-list.css'
})
export class AssetListComponent implements OnInit {
  assetsList$!: Observable<any[]>;
  employeesList$!: Observable<any[]>;
  currentAsset: any = {
    id: 0,
    name: '',
    serialNumber: '',
    price: 0,
    employeeId: null
  };
  isEditing = false;
  constructor(private assetService: AssetService,
    private employeeService: EmployeeService) {}

 ngOnInit(): void {
    this.loadData();
  }
   loadData(): void {
    this.assetsList$ = this.assetService.getAssets();
    this.employeesList$ = this.employeeService.getEmployees();
  }
  saveAsset(): void {
    if (!this.currentAsset.name || !this.currentAsset.serialNumber) return;

    // Map properties explicitly to match your C# DTO / Model properties
    const payload = {
      id: this.currentAsset.id,
      name: this.currentAsset.name,
      serialNumber: this.currentAsset.serialNumber,
      price: Number(this.currentAsset.price),
      employeeId: this.currentAsset.employeeId ? Number(this.currentAsset.employeeId) : null
    };

    if (this.isEditing) {
      this.assetService.updateAsset(this.currentAsset.id, payload).subscribe({
        next: () => {
          this.resetForm();
          this.loadData();
        }
      });
    } else {
      this.assetService.addAsset(payload).subscribe({
        next: () => {
          this.resetForm();
          this.loadData();
        }
      });
    }
  }
  editAsset(asset: any): void {
    this.isEditing = true;
    this.currentAsset = {
      id: asset.Id || asset.id,
      name: asset.Name || asset.name,
      serialNumber: asset.SerialNumber || asset.serialNumber,
      price: asset.Price || asset.price || 0,
      employeeId: asset.EmployeeId || asset.employeeId || null
    };
  }
  deleteAsset(id: number): void {
    if (confirm('Are you sure you want to delete this asset?')) {
      this.assetService.deleteAsset(id).subscribe({
        next: () => this.loadData()
      });
    }
  }

  resetForm(): void {
    this.isEditing = false;
    this.currentAsset = { id: 0, name: '', serialNumber: '', price: 0, employeeId: null };
  }
}