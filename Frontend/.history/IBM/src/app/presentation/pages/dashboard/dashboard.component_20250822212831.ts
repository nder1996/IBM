import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

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

  constructor(private router: Router) { }

  ngOnInit(): void {
    console.log('Dashboard cargado de forma perezosa');
  }

  loadUserManagement(): void {
    // Navegar al módulo de gestión de usuarios (lazy loaded)
    this.router.navigate(['/users']);
  }
}
