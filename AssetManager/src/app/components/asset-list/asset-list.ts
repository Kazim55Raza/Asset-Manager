import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssetService } from '../../asset.spec';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-asset-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './asset-list.html',
  styleUrl: './asset-list.css'
})
export class AssetListComponent implements OnInit {
  assetsList$!: Observable<any[]>;

  constructor(private assetService: AssetService) {}

  ngOnInit(): void {
    this.assetsList$ = this.assetService.getAssets();
  }
}