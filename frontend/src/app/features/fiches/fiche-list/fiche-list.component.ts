import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FicheService } from '../../../services/fiche.service';
import { AuthService } from '../../../core/services/auth.service';
import { FicheSuivi, RoleNom } from '../../../models/utilisateur.model';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-fiche-list',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatTableModule],
  templateUrl: './fiche-list.component.html'
})
export class FicheListComponent implements OnInit {
  private ficheService = inject(FicheService);
  private authService = inject(AuthService);
  private router = inject(Router);

  fiches: any[] = [];
  displayedColumns: string[] = ['dateSaisie', 'projet', 'avancement', 'statut', 'actions'];
  isLoading = true;

  ngOnInit() {
    this.loadFiches();
  }

  loadFiches() {
    this.isLoading = true;
    const role = this.authService.getCurrentUserRole();

    if (role === RoleNom.PILOTE_QUALITE || role === RoleNom.ADMIN) {
      this.ficheService.getAllFichesSuivi().subscribe({
        next: (data) => {
          this.fiches = data;
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
        }
      });
    } else {
      // For Chef de Projet, we could filter by their projects
      this.ficheService.getAllFichesSuivi().subscribe({
        next: (data) => {
          // In a real scenario, the backend would handle filtering or we'd filter here
          this.fiches = data; 
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
        }
      });
    }
  }

  getStatusColor(avancement: number): string {
    if (avancement >= 90) return 'text-green-600 bg-green-100';
    if (avancement >= 50) return 'text-blue-600 bg-blue-100';
    return 'text-orange-600 bg-orange-100';
  }

  viewDetails(fiche: any) {
    if (!fiche.projetId) return;
    const role = this.authService.getCurrentUserRole();
    if (role === RoleNom.CHEF_PROJET) {
      // Use inject(Router) or add it to constructor. I will inject Router.
      this.router.navigate(['/chef/projets', fiche.projetId]);
    } else {
      // Pilot or Admin may not have a dedicated detail view yet
      console.log('View details not fully implemented for role:', role);
    }
  }
}
