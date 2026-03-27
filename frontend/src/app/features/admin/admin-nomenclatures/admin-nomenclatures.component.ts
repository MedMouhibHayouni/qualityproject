import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NomenclatureService } from '../../../services/nomenclature.service';
import { Nomenclature } from '../../../core/models/app.models';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-admin-nomenclatures',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './admin-nomenclatures.component.html'
})
export class AdminNomenclaturesComponent implements OnInit {
  private nomenclatureService = inject(NomenclatureService);
  private fb = inject(FormBuilder);
  private toastr = inject(ToastrService);

  nomenclatures: Nomenclature[] = [];
  selectedType = '';
  types = ['ROLE', 'STATUT', 'TYPE_PROJET', 'STATUT_PROJET', 'TYPE_NOTIFICATION'];
  
  showAddModal = false;
  nomForm: FormGroup = this.fb.group({
    code: ['', Validators.required],
    libelle: ['', Validators.required],
    categorie: ['TYPE_PROJET', Validators.required],
    description: ['']
  });

  ngOnInit() {
    this.loadNomenclatures();
  }

  loadNomenclatures() {
    const obs = this.selectedType 
      ? this.nomenclatureService.getByType(this.selectedType)
      : this.nomenclatureService.getAll();
      
    obs.subscribe({
      next: (data) => this.nomenclatures = data
    });
  }

  openAddModal() {
    this.showAddModal = true;
    this.nomForm.reset({ categorie: 'TYPE_PROJET' });
  }

  closeModal() {
    this.showAddModal = false;
  }

  saveNomenclature() {
    if (this.nomForm.invalid) return;
    this.nomenclatureService.create({
      typeStructure: this.nomForm.value.categorie,
      nomStructure: this.nomForm.value.code,
      description: this.nomForm.value.libelle // logic mapping libelle to desc if needed
    } as any).subscribe({
      next: () => {
        this.toastr.success('Nomenclature ajoutée');
        this.loadNomenclatures();
        this.closeModal();
      },
      error: () => this.toastr.error('Erreur lors de l\'ajout')
    });
  }
}
