import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { Role, RoleNom, Utilisateur } from '../../../models/utilisateur.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-create.component.html'
})
export class UserCreateComponent implements OnInit {
  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private router = inject(Router);
  private toastr = inject(ToastrService);

  userForm: FormGroup = this.fb.group({
    nom: ['', Validators.required],
    prenom: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    motDePasse: ['', [Validators.required, Validators.minLength(6)]],
    roleId: ['', Validators.required],
    actif: [true]
  });

  roles: Role[] = [];

  ngOnInit() {
    this.userService.getRoles().subscribe({
      next: (roles) => this.roles = roles,
      error: () => this.toastr.error('Erreur lors du chargement des rôles')
    });
  }

  onSubmit() {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    const formValue = this.userForm.value;
    const selectedRole = this.roles.find(r => r.id === formValue.roleId);

    const newUser: Partial<Utilisateur> = {
      nom: formValue.nom as string,
      prenom: formValue.prenom as string,
      email: formValue.email as string,
      motDePasse: formValue.motDePasse as string,
      roles: [selectedRole as Role],
      actif: formValue.actif as boolean
    };

    this.userService.createUser(newUser).subscribe({
      next: () => {
        this.toastr.success('Utilisateur créé avec succès');
        this.router.navigate(['/admin/users']);
      },
      error: () => this.toastr.error('Erreur lors de la création de l\'utilisateur')
    });
  }
}
