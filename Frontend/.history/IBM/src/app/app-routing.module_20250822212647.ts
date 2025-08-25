import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  // Lazy loading para el módulo de login
  {
    path: 'login',
    loadChildren: () => import('./presentation/pages/login/login.module').then(m => m.LoginModule)
  },
  // Lazy loading para el módulo de dashboard
  {
    path: 'dashboard',
    loadChildren: () => import('./presentation/pages/dashboard/dashboard.module').then(m => m.DashboardModule)
  },
  // Lazy loading para módulos de funcionalidades
  {
    path: 'users',
    loadChildren: () => import('./presentation/pages/user-management/user-management.module').then(m => m.UserManagementModule)
  },
  // Redireccionamiento por defecto
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  // Ruta wildcard para páginas no encontradas (debe ir al final)
  {
    path: '**',
    redirectTo: '/login'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    // Configuración adicional para lazy loading
    preloadingStrategy: /* PreloadAllModules */ undefined, // Comentado para mostrar lazy loading puro
    enableTracing: false // true para debug de routing
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
