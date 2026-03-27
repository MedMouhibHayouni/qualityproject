import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjetService } from '../../../services/projet.service';
import { Project } from '../../../core/models/app.models';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ProjectFormDialogComponent } from '../project-form-dialog/project-form-dialog.component';

@Component({
  selector: 'app-fiche-projet-details',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatDialogModule],
  templateUrl: './fiche-projet-details.component.html'
})
export class FicheProjetDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private projetService = inject(ProjetService);
  private dialog = inject(MatDialog);
  private toastr = inject(ToastrService);
  
  projet?: Project;

  ngOnInit() {
    this.loadProjectDetails();
  }

  loadProjectDetails() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.projetService.getById(id).subscribe((data: Project) => this.projet = data);
    }
  }

  goBack() {
    this.router.navigate(['/chef/projets']);
  }

  getStatusClass(statut: string) {
    switch (statut?.toLowerCase()) {
      case 'terminé': return 'bg-emerald-50 text-emerald-700 font-bold';
      case 'en cours': return 'bg-blue-50 text-blue-700 font-bold';
      case 'retard': return 'bg-red-50 text-red-700 font-bold';
      default: return 'bg-slate-100 text-slate-700 font-bold';
    }
  }

  exportProjectDetails() {
    this.toastr.info('Fonctionnalité d\'export en cours de développement');
  }

  editProject() {
    if (!this.projet) return;
    
    const dialogRef = this.dialog.open(ProjectFormDialogComponent, {
      width: '650px',
      maxWidth: '95vw',
      panelClass: ['modern-dialog', 'overflow-hidden'],
      data: { project: this.projet },
      autoFocus: 'first-tabbable',
      restoreFocus: true
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result && this.projet?.id) {
        this.projetService.update(this.projet.id, result).subscribe({
          next: () => {
            this.toastr.success('Projet mis à jour avec succès');
            this.loadProjectDetails();
          },
          error: () => this.toastr.error('Erreur lors de la mise à jour du projet')
        });
      }
    });
  }
}
