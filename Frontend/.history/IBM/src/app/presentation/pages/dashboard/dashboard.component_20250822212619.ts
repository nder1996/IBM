import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  cards = [
    { title: 'Usuarios', count: 150, icon: 'people' },
    { title: 'Ventas', count: 45, icon: 'shopping_cart' },
    { title: 'Reportes', count: 12, icon: 'assessment' },
    { title: 'Configuración', count: 3, icon: 'settings' }
  ];

  constructor() { }

  ngOnInit(): void {
    console.log('Dashboard cargado de forma perezosa');
  }

  loadUserManagement(): void {
    // Aquí se cargaría el módulo de gestión de usuarios de forma perezosa
    console.log('Cargando módulo de usuarios...');
  }
}
