import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-report',
  template: `
    <div class="report-container">
      <h3>📄 Componente de Reportes (Cargado Dinámicamente)</h3>
      <p>Este componente también fue cargado de forma perezosa</p>
      
      <div class="report-summary">
        <div class="summary-item">
          <span class="label">Total de usuarios:</span>
          <span class="value">{{ reportData.totalUsers }}</span>
        </div>
        <div class="summary-item">
          <span class="label">Ventas del mes:</span>
          <span class="value">{{ reportData.monthlySales | currency }}</span>
        </div>
        <div class="summary-item">
          <span class="label">Crecimiento:</span>
          <span class="value growth">+{{ reportData.growth }}%</span>
        </div>
      </div>
      
      <div class="report-actions">
        <button (click)="generateReport()" class="action-btn primary">
          Generar Reporte
        </button>
        <button (click)="exportReport()" class="action-btn secondary">
          Exportar PDF
        </button>
      </div>
      
      <p class="load-info">
        <small>Componente cargado: {{ loadTime }}</small>
      </p>
    </div>
  `,
  styles: [`
    .report-container {
      background: white;
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 1.5rem;
      margin: 1rem 0;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    .report-summary {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin: 1.5rem 0;
    }
    
    .summary-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      background: #f8f9fa;
      border-radius: 6px;
      border-left: 4px solid #ff9800;
    }
    
    .label {
      font-weight: 500;
      color: #666;
    }
    
    .value {
      font-weight: bold;
      color: #333;
      font-size: 1.1rem;
    }
    
    .growth {
      color: #4CAF50;
    }
    
    .report-actions {
      display: flex;
      gap: 1rem;
      margin: 1.5rem 0;
    }
    
    .action-btn {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.3s ease;
    }
    
    .action-btn.primary {
      background: #ff9800;
      color: white;
    }
    
    .action-btn.secondary {
      background: #e0e0e0;
      color: #333;
    }
    
    .action-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    }
    
    .load-info {
      background: #fff3e0;
      padding: 10px;
      border-radius: 4px;
      border-left: 4px solid #ff9800;
      margin-top: 1rem;
    }
    
    h3 {
      color: #ff9800;
      margin: 0 0 1rem 0;
    }
  `],
  standalone: true // Componente standalone para facilitar la carga dinámica
})
export class ReportComponent implements OnInit {
  loadTime: string = '';
  reportData = {
    totalUsers: 1247,
    monthlySales: 45600,
    growth: 12.5
  };

  constructor() { }

  ngOnInit(): void {
    this.loadTime = new Date().toLocaleTimeString();
    console.log('ReportComponent inicializado de forma perezosa');
  }

  generateReport(): void {
    console.log('Generando reporte...');
    // Simular generación de reporte
    setTimeout(() => {
      alert('Reporte generado exitosamente');
    }, 1000);
  }

  exportReport(): void {
    console.log('Exportando reporte a PDF...');
    // Simular exportación
    setTimeout(() => {
      alert('Reporte exportado a PDF');
    }, 800);
  }
}
