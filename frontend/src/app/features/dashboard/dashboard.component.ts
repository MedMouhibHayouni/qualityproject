import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KPIService } from '../../core/services/kpi.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  private kpiService = inject(KPIService);

  ngOnInit() {
    this.initCharts();
  }

  initCharts() {
    setTimeout(() => {
      new Chart('evolutionChart', {
        type: 'line',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          datasets: [{
            label: 'Projets Complétés',
            data: [12, 19, 15, 25, 22, 30],
            borderColor: '#0ea5e9',
            backgroundColor: 'rgba(14, 165, 233, 0.1)',
            fill: true,
            tension: 0.4
          }]
        },
        options: { responsive: true, maintainAspectRatio: false }
      });

      new Chart('statusChart', {
        type: 'doughnut',
        data: {
          labels: ['En cours', 'Terminé', 'Retard', 'Suspendu'],
          datasets: [{
            data: [45, 30, 15, 10],
            backgroundColor: ['#0ea5e9', '#10b981', '#f59e0b', '#ef4444']
          }]
        },
        options: { responsive: true, maintainAspectRatio: false }
      });
    }, 500);
  }

  exportPDF() {
    this.kpiService.exportPDF().subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'kpi_report.pdf';
      a.click();
    });
  }

  exportExcel() {
    this.kpiService.exportExcel().subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'kpi_report.xlsx';
      a.click();
    });
  }
}
