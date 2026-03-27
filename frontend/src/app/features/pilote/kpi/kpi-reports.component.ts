import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KpiService } from '../../../services/kpi.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-kpi-reports',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  templateUrl: './kpi-reports.component.html',
  styleUrls: ['./kpi-reports.component.css']
})
export class KpiReportsComponent implements OnInit {
  private kpiService = inject(KpiService);

  stats: any = {
    totalProjets: 0,
    projetsEnCours: 0,
    projetsTermines: 0,
    projetsEnRetard: 0,
    avancementMoyen: 0,
    totalFiches: 0
  };

  isLoading = true;
  downloadingPdf = false;
  downloadingExcel = false;

  ngOnInit() {
    this.kpiService.getGlobalStats().subscribe({
      next: (globalStats) => {
        this.stats.totalProjets = globalStats.totalProjets;
        this.stats.totalFiches = globalStats.totalFiches;
        this.stats.avancementMoyen = Math.round(globalStats.tauxCompletionMoyen);
        this.stats.projetsEnRetard = globalStats.projetsEnRetard;
        this.stats.projetsEnCours = globalStats.totalProjets - globalStats.projetsEnRetard - (this.stats.projetsTermines || 0);
        this.isLoading = false;
      },
      error: () => { this.isLoading = false; }
    });
  }

  downloadPdf() {
    this.downloadingPdf = true;
    this.kpiService.exportPdf().subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'rapport_kpi.pdf';
        a.click();
        window.URL.revokeObjectURL(url);
        this.downloadingPdf = false;
      },
      error: () => { this.downloadingPdf = false; }
    });
  }

  downloadExcel() {
    this.downloadingExcel = true;
    this.kpiService.exportExcel().subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'rapport_kpi.xlsx';
        a.click();
        window.URL.revokeObjectURL(url);
        this.downloadingExcel = false;
      },
      error: () => { this.downloadingExcel = false; }
    });
  }
}
