import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AssetService } from '../../asset.spec';
import { EmployeeService } from '../../employee.spec';
import { Observable, take } from 'rxjs';
import * as XLSX from 'xlsx'; // 👈 1. Import SheetJS at the top

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
  // 🔑 1. Add the search query property
  searchQuery: string = '';

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
  // 🚀 2. Add this Excel Export Method
  exportToExcel(): void {
    // Read the current asset data array from the observable stream safely
    this.assetsList$.pipe(take(1)).subscribe({
      next: (assets) => {
        if (!assets || assets.length === 0) {
          alert('No assets available to export.');
          return;
        }

        // 📊 Map properties into clean, professional excel headers
        const formattedData = assets.map(asset => ({
          'Asset ID': `#${asset.Id || asset.id}`,
          'Hardware Name': asset.Name || asset.name,
          'Serial Number': asset.SerialNumber || asset.serialNumber,
          'Asset Price (USD)': asset.Price || asset.price || 0,
          'Assigned Employee': asset.AssignedToEmployee || asset.assignedToEmployee || 'Unassigned Reserve'
        }));

        // 🗂️ Generate Sheet and Workbook
        const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(formattedData);
        const workbook: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Corporate Assets');

        // 💾 Download File
        XLSX.writeFile(workbook, 'AssetManager_Inventory_Report.xlsx');
      }
    });
  }

  // 🔑 2. Add a helper method to filter assets in the UI template
  getFilteredAssets(assets: any[] | null): any[] {
    if (!assets) return [];
    if (!this.searchQuery.trim()) return assets;

    const query = this.searchQuery.toLowerCase().trim();

    return assets.filter(asset => {
      const name = (asset.Name || asset.name || '').toLowerCase();
      const serial = (asset.SerialNumber || asset.serialNumber || '').toLowerCase();
      const employee = (asset.AssignedToEmployee || asset.assignedToEmployee || 'unassigned reserve').toLowerCase();

      return name.includes(query) || serial.includes(query) || employee.includes(query);
    });
  }

}