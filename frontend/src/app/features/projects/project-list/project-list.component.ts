import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectFormDialogComponent } from '../project-form-dialog/project-form-dialog.component';
import { FicheSuiviFormDialogComponent } from '../fiche-suivi-form-dialog/fiche-suivi-form-dialog.component';
import { ProjetService } from '../../../services/projet.service';
import { FicheService } from '../../../services/fiche.service';
import { Project } from '../../../core/models/app.models';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatTableModule, MatDialogModule, MatTooltipModule],
  templateUrl: './project-list.component.html',
  styleUrl: './project-list.component.css'
})
export class ProjectListComponent implements OnInit {
  private projetService = inject(ProjetService);
  private ficheService = inject(FicheService);
  private dialog = inject(MatDialog);
  private toastr = inject(ToastrService);
  private router = inject(Router);
  projets: Project[] = [];
  displayedColumns: string[] = ['nom', 'responsable', 'statut', 'actions'];

  ngOnInit() {
    this.loadProjects();
  }

  loadProjects() {
    this.projetService.getAll().subscribe((data: Project[]) => this.projets = data);
  }

  getStatusClass(statut: string) {
    switch (statut?.toLowerCase()) {
      case 'terminé': return 'bg-emerald-50 text-emerald-700';
      case 'en cours': return 'bg-blue-50 text-blue-700';
      case 'retard': return 'bg-red-50 text-red-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  }

  viewProjectDetails(project: Project) {
    if (project.id) {
      this.router.navigate(['/chef/projets', project.id]);
    }
  }

  openProjectForm(project?: Project) {
    const dialogRef = this.dialog.open(ProjectFormDialogComponent, {
      width: '650px',
      maxWidth: '95vw',
      panelClass: ['modern-dialog', 'overflow-hidden'],
      data: { project },
      autoFocus: 'first-tabbable',
      restoreFocus: true
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        if (project?.id) {
          this.projetService.update(project.id, result).subscribe({
            next: () => {
              this.toastr.success('Projet mis à jour avec succès');
              this.loadProjects();
            },
            error: () => this.toastr.error('Erreur lors de la mise à jour')
          });
        } else {
          this.projetService.create(result).subscribe({
            next: () => {
              this.toastr.success('Nouveau projet créé avec succès');
              this.loadProjects();
            },
            error: () => this.toastr.error('Erreur lors de la création')
          });
        }
      }
    });
  }

  openFicheSuiviForm(project: Project) {
    if (!project.id) return;
    
    const dialogRef = this.dialog.open(FicheSuiviFormDialogComponent, {
      width: '550px',
      maxWidth: '95vw',
      panelClass: 'modern-dialog',
      data: { project }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result && project.id) {
        this.ficheService.addFicheSuivi(project.id, result).subscribe({
          next: () => {
            this.toastr.success('Fiche de suivi ajoutée avec succès');
            this.loadProjects();
          },
          error: () => this.toastr.error('Erreur lors de l\'ajout de la fiche')
        });
      }
    });
  }

  getProjectIcon(nom: string): string {
    const lowerNom = nom.toLowerCase();
    if (lowerNom.includes('iso')) return 'verified';
    if (lowerNom.includes('audit')) return 'fact_check';
    if (lowerNom.includes('lean') || lowerNom.includes('kaizen')) return 'trending_up';
    if (lowerNom.includes('digital')) return 'phishing';
    return 'assignment';
  }

  getProjectsByStatut(statut: string): Project[] {
    return this.projets.filter(p => p.statut?.toLowerCase() === statut.toLowerCase());
  }
}
