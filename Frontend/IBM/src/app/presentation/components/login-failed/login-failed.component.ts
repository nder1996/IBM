import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-failed',
  templateUrl: './login-failed.component.html',
  styleUrls: ['./login-failed.component.css']
})
export class LoginFailedComponent {

  constructor(private router: Router) {}

  goToLogin(): void {
    this.router.navigate(['/auth/login']);
  }

  resetPassword(): void {
    // Implementar lógica para restablecer contraseña
    console.log('Restableciendo contraseña...');
  }

  getHelp(): void {
    // Implementar lógica para obtener ayuda
    console.log('Contactando soporte...');
  }

  createAccount(): void {
    // Implementar lógica para crear cuenta
    console.log('Redirigiendo a creación de cuenta...');
  }
}
