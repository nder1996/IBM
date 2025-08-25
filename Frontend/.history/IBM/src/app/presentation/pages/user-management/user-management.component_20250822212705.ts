import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-management',
  template: `
    <div class="user-management-container">
      <h1>Gestión de Usuarios</h1>
      <p>Este módulo se cargó de forma perezosa desde el Dashboard</p>
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
    .user-management-container {
      padding: 2rem;
    }
    h1 {
      color: #333;
      margin-bottom: 1rem;
    }
  `]
})
export class UserManagementComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    console.log('Módulo de gestión de usuarios cargado de forma perezosa');
  }
}
