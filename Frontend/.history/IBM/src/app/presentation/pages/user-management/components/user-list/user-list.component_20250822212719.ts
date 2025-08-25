import { Component, OnInit } from '@angular/core';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

@Component({
  selector: 'app-user-list',
  template: `
    <div class="user-list-container">
      <h2>Lista de Usuarios</h2>
      
      <mat-form-field appearance="fill" class="search-field">
        <mat-label>Buscar usuarios</mat-label>
        <input matInput (keyup)="applyFilter($event)" placeholder="Buscar...">
        <mat-icon matSuffix>search</mat-icon>
      </mat-form-field>

      <div class="table-container">
        <table mat-table [dataSource]="users" class="mat-elevation-8">
          <ng-container matColumnDef="id">
            <th mat-header-cell *matHeaderCellDef>ID</th>
            <td mat-cell *matCellDef="let user">{{ user.id }}</td>
          </ng-container>

          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef>Nombre</th>
            <td mat-cell *matCellDef="let user">{{ user.name }}</td>
          </ng-container>

          <ng-container matColumnDef="email">
            <th mat-header-cell *matHeaderCellDef>Email</th>
            <td mat-cell *matCellDef="let user">{{ user.email }}</td>
          </ng-container>

          <ng-container matColumnDef="role">
            <th mat-header-cell *matHeaderCellDef>Rol</th>
            <td mat-cell *matCellDef="let user">{{ user.role }}</td>
          </ng-container>

          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Acciones</th>
            <td mat-cell *matCellDef="let user">
              <button mat-icon-button color="primary">
                <mat-icon>edit</mat-icon>
              </button>
              <button mat-icon-button color="warn">
                <mat-icon>delete</mat-icon>
              </button>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .user-list-container {
      padding: 1rem;
    }
    .search-field {
      width: 100%;
      margin-bottom: 1rem;
    }
    .table-container {
      max-width: 100%;
      overflow: auto;
    }
    table {
      width: 100%;
    }
  `]
})
export class UserListComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'email', 'role', 'actions'];
  users: User[] = [
    { id: 1, name: 'Juan Pérez', email: 'juan@example.com', role: 'Admin' },
    { id: 2, name: 'María García', email: 'maria@example.com', role: 'Usuario' },
    { id: 3, name: 'Carlos López', email: 'carlos@example.com', role: 'Editor' },
    { id: 4, name: 'Ana Martínez', email: 'ana@example.com', role: 'Usuario' },
  ];

  constructor() { }

  ngOnInit(): void {
    console.log('Componente de lista de usuarios cargado');
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    console.log('Filtrar por:', filterValue);
    // Aquí implementarías la lógica de filtrado
  }
}
