import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BaseChartDirective } from 'ng2-charts';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { KpiService } from '../../../services/kpi.service';
import { FicheService } from '../../../services/fiche.service';
import { ProjetService } from '../../../services/projet.service';
import { NotificationService } from '../../../services/notification.service';
import { GlobalStats, KPI } from '../../../models/kpi.model';

@Component({
  selector: 'app-pilote-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, BaseChartDirective],
  templateUrl: './pilote-dashboard.component.html',
  styleUrls: ['./pilote-dashboard.component.css']
})
export class PiloteDashboardComponent implements OnInit {
  kpiService = inject(KpiService);
  ficheService = inject(FicheService);
  projetService = inject(ProjetService);
  notificationService = inject(NotificationService);
  toastr = inject(ToastrService);
  spinner = inject(NgxSpinnerService);

  stats: GlobalStats | null = null;
  fiches: any[] = [];
  periodeFilter = 30; // jours
  
  // Charts Configurations
  public chartOptions = { responsive: true, maintainAspectRatio: false };
  public lineChartData = {
    labels: ['Jan', 'Fev', 'Mar', 'Avr', 'Mai', 'Jun'],
    datasets: [{ data: [65, 59, 80, 81, 56, 55], label: 'Taux avancement global', borderColor: '#14b8a6', tension: 0.4 }]
  };
  
  public doughnutChartData = {
    labels: ['En cours', 'Terminés', 'En retard'],
    datasets: [{ data: [15, 45, 10], backgroundColor: ['#3b82f6', '#10b981', '#ef4444'] }]
  };

  public barChartData = {
    labels: ['Projet A', 'Projet B', 'Projet C', 'Projet D'],
    datasets: [{ data: [12, 19, 3, 5], label: 'Non-conformités', backgroundColor: '#a855f7' }]
  };

  ngOnInit() {
    this.refreshData();
    // Auto-refresh every 60s
    setInterval(() => this.refreshData(false), 60000);
  }

  refreshData(showSpinner = true) {
    if (showSpinner) this.spinner.show();
    
    this.kpiService.getGlobalStats().subscribe({
      next: (data) => {
        this.stats = data;
        this.loadFiches();
        this.loadDoughnutChart();
        if (showSpinner) this.spinner.hide();
      },
      error: () => {
        if (showSpinner) this.spinner.hide();
      }
    });

    this.kpiService.getAll().subscribe({
      next: (kpis: KPI[]) => {
        // Map true data to charts in a complete implementation
      }
    });
  }

  loadFiches() {
  this.ficheService.getAllFichesSuivi().subscribe({
    next: (res: any[]) => this.fiches = (res || []).filter(f => f != null)
  });
}

  loadDoughnutChart() {
    this.projetService.getAll().subscribe({
      next: (projets) => {
        const enCours = projets.filter(p => !p.statut || p.statut === 'EN_COURS' || p.statut === 'NOUVEAU').length;
        const termines = projets.filter(p => p.statut === 'TERMINE').length;
        const enRetard = projets.filter(p => p.statut === 'EN_RETARD').length;

        this.doughnutChartData = {
          ...this.doughnutChartData,
          datasets: [{ ...this.doughnutChartData.datasets[0], data: [enCours, termines, enRetard] }]
        };

        const projectNames = projets.slice(0, 4).map(p => p.nomProjet);
        const randomAnomalies = projectNames.map(() => Math.floor(Math.random() * 10)); // simulated
        if (projectNames.length > 0) {
          this.barChartData = {
            ...this.barChartData,
            labels: projectNames,
            datasets: [{ ...this.barChartData.datasets[0], data: randomAnomalies, label: 'Non-conformités par Projet' }]
          };
        }
      }
    });
  }

  exporterPdf() {
    this.kpiService.exportPdf().subscribe((blob: Blob) => {
      const url = window.URL.createObjectURL(blob);
      window.open(url);
    });
  }

  exporterExcel() {
    this.kpiService.exportExcel().subscribe((blob: Blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Rapport_KPI.xlsx';
      a.click();
    });
  }

  notifierRetard(fiche: any) {
    if (!fiche.responsableAction) return;
    this.notificationService.envoyerNotification(fiche.responsableAction.id, `Retard signalé sur la fiche ${fiche.id}`, 'RETARD')
      .subscribe({
        next: () => this.toastr.success('Notification de retard envoyée avec succès.')
      });
  }
}
