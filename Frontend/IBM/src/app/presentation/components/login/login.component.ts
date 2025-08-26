import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../application/services/auth.service';
import { firstValueFrom } from 'rxjs';
import { LocalStorageService } from 'src/app/application/services/local-storage.service';
import { AuthResponse } from 'src/app/application/dtos/response/auth.Response.dto';
import { NotificationService } from 'src/app/application/services/notification.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  hide = true;
  loginForm!: FormGroup;

  constructor(
    private router: Router,
    private authService: AuthService,
    private storage: LocalStorageService,
    private fb: FormBuilder,
    private notificationService: NotificationService // Inyección del servicio de notificaciones
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.loginForm = this.fb.group({
      username: ['juan.perez', [Validators.required, Validators.minLength(3)]],
      password: ['password123', [Validators.required, Validators.minLength(6)]]
    });
  }

  async onLogin() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    try {
      const username = this.loginForm.get('username')?.value;
      const password = this.loginForm.get('password')?.value;

      await firstValueFrom(this.authService.login(username, password));
      const response: AuthResponse = this.storage.getItem("auth_token") ?? new AuthResponse();
      if (this.authService.isAuthenticatedSync()) {
        this.showSuccessNotification(); // Mostrar notificación de éxito
        this.router.navigate(['/auth/welcome']);
      } else {
        console.warn('Faltan datos en la respuesta. Redirigiendo a login fallido.');
        this.showWarningNotification(); // Mostrar notificación de advertencia
        this.router.navigate(['/auth/login-failed']);
      }
    } catch (err) {
      console.error('Error de autenticación:', err);
      this.showErrorNotification(); // Mostrar notificación de error
      this.router.navigate(['/auth/login-failed']);
    }
  }

  // Método para mostrar una notificación de éxito
  showSuccessNotification(): void {
    this.notificationService.showSuccess('Inicio de sesión exitoso');
  }

  // Método para mostrar una notificación de error
  showErrorNotification(): void {
    this.notificationService.showError('Error al iniciar sesión');
  }

  // Método para mostrar una notificación de advertencia
  showWarningNotification(): void {
    this.notificationService.showWarning('Advertencia: Verifica tus datos');
  }

  // Método para mostrar una notificación de información
  showInfoNotification(): void {
    this.notificationService.showInfo('Información: Ingresa tus credenciales');
  }

  // Getters para acceder a los campos del formulario y sus estados
  get usernameControl() { return this.loginForm.get('username'); }
  get passwordControl() { return this.loginForm.get('password'); }

  get usernameInvalid() { return this.usernameControl?.invalid && (this.usernameControl?.touched || this.usernameControl?.dirty); }
  get passwordInvalid() { return this.passwordControl?.invalid && (this.passwordControl?.touched || this.passwordControl?.dirty); }
}
