import { Utilisateur } from './utilisateur.model';

export interface Projet {
  id?: string;
  nomProjet: string;
  description: string;
  objectifs: string;
  dateDebut: string | Date;
  dateFinPrevue: string | Date;
  statut: string; // nomenclature label or code
  avancement?: number;
  kpiGlobal?: number;
  chefDeProjet?: { id: string };
}

export interface FicheProjet {
  id?: string;
  dateCreation: string | Date;
  responsableId?: string;
  documents?: string[];
  nomProjet: string;
  description: string;
  objectifs: string;
  responsable: string;
  echeances: string;
  statut: string;
}

export interface FicheSuivi {
  id?: string;
  dateSaisie: string | Date;
  avancement: number;
  problemes: string;
  decisions: string;
  indicateurs: string;
  sujet?: string;
  observations?: string;
  statut?: string;
  ficheProjet?: FicheProjet; // Added for frontend convenience if joined
}
