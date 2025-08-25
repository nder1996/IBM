import { Component, OnInit, ViewContainerRef, ComponentRef } from '@angular/core';

@Component({
  selector: 'app-lazy-component-demo',
  template: `
    <div class="lazy-demo-container">
      <h2>Demo de Carga Perezosa de Componentes</h2>
      
      <div class="buttons-container">
        <button mat-raised-button color="primary" (click)="loadChartComponent()">
          Cargar Componente de Gráficos
        </button>
        
        <button mat-raised-button color="accent" (click)="loadReportComponent()">
          Cargar Componente de Reportes
        </button>
        
        <button mat-raised-button color="warn" (click)="clearComponents()">
          Limpiar Componentes
        </button>
      </div>

      <div class="dynamic-content" #dynamicContainer>
        <!-- Los componentes cargados dinámicamente aparecerán aquí -->
      </div>
    </div>
  `,
  styles: [`
    .lazy-demo-container {
      padding: 2rem;
      border: 2px dashed #ccc;
      margin: 1rem 0;
      border-radius: 8px;
    }
    
    .buttons-container {
      margin: 1rem 0;
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
    }
    
    .dynamic-content {
      margin-top: 2rem;
      min-height: 200px;
      border: 1px solid #eee;
      border-radius: 4px;
      padding: 1rem;
      background-color: #fafafa;
    }
  `]
})
export class LazyComponentDemoComponent implements OnInit {
  private loadedComponents: ComponentRef<any>[] = [];

  constructor(private viewContainer: ViewContainerRef) { }

  ngOnInit(): void {
    console.log('Demo de componentes lazy cargado');
  }

  async loadChartComponent(): Promise<void> {
    try {
      // Carga perezosa del componente de gráficos
      const { ChartComponent } = await import('./components/chart/chart.component');
      const componentRef = this.viewContainer.createComponent(ChartComponent);
      this.loadedComponents.push(componentRef);
      console.log('Componente de gráficos cargado de forma perezosa');
    } catch (error) {
      console.error('Error al cargar el componente de gráficos:', error);
    }
  }

  async loadReportComponent(): Promise<void> {
    try {
      // Carga perezosa del componente de reportes
      const { ReportComponent } = await import('./components/report/report.component');
      const componentRef = this.viewContainer.createComponent(ReportComponent);
      this.loadedComponents.push(componentRef);
      console.log('Componente de reportes cargado de forma perezosa');
    } catch (error) {
      console.error('Error al cargar el componente de reportes:', error);
    }
  }

  clearComponents(): void {
    // Destruir todos los componentes cargados dinámicamente
    this.loadedComponents.forEach(component => component.destroy());
    this.loadedComponents = [];
    this.viewContainer.clear();
    console.log('Componentes dinámicos limpiados');
  }

  ngOnDestroy(): void {
    // Limpiar componentes al destruir este componente
    this.clearComponents();
  }
}
