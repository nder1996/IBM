import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-chart',
  template: `
    <div class="chart-container">
      <h3>📊 Componente de Gráficos (Cargado Dinámicamente)</h3>
      <p>Este componente fue cargado de forma perezosa usando dynamic imports</p>
      
      <div class="mock-chart">
        <div class="bar" style="height: 80%"></div>
        <div class="bar" style="height: 60%"></div>
        <div class="bar" style="height: 90%"></div>
        <div class="bar" style="height: 45%"></div>
        <div class="bar" style="height: 70%"></div>
      </div>
      
      <p class="chart-info">
        <strong>Datos simulados:</strong> Ventas por mes<br>
        <small>Componente cargado: {{ loadTime }}</small>
      </p>
    </div>
  `,
  styles: [`
    .chart-container {
      background: white;
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 1.5rem;
      margin: 1rem 0;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    .mock-chart {
      display: flex;
      align-items: end;
      height: 150px;
      gap: 10px;
      margin: 1rem 0;
      padding: 10px;
      background: #f8f9fa;
      border-radius: 4px;
    }
    
    .bar {
      background: linear-gradient(to top, #4CAF50, #8BC34A);
      width: 40px;
      border-radius: 4px 4px 0 0;
      transition: all 0.3s ease;
    }
    
    .bar:hover {
      transform: scale(1.05);
      box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    }
    
    .chart-info {
      background: #e3f2fd;
      padding: 10px;
      border-radius: 4px;
      border-left: 4px solid #2196F3;
    }
    
    h3 {
      color: #2196F3;
      margin: 0 0 1rem 0;
    }
  `],
  standalone: true // Componente standalone para facilitar la carga dinámica
})
export class ChartComponent implements OnInit {
  loadTime: string = '';

  constructor() { }

  ngOnInit(): void {
    this.loadTime = new Date().toLocaleTimeString();
    console.log('ChartComponent inicializado de forma perezosa');
  }
}
