import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginFailedComponent } from './components/login-failed/login-failed.component';
import { LoginComponent } from './components/login/login.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { MainViewComponent } from './pages/main-view/main-view.component';
import { AuthGuard } from '../application/auth/auth.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'login-failed', component: LoginFailedComponent },
  { path: 'welcome', component: WelcomeComponent, canActivate: [AuthGuard] },
  { path: 'main', component: MainViewComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
