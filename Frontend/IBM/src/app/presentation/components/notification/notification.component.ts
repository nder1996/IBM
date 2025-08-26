import { Component } from '@angular/core';
import { NotificationService } from 'src/app/application/services/notification.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent {
  constructor(private notificationService: NotificationService) {}

  showSuccess(): void {
    this.notificationService.showSuccess('Operación exitosa');
  }

  showError(): void {
    this.notificationService.showError('Ocurrió un error');
  }

  showInfo(): void {
    this.notificationService.showInfo('Información importante');
  }

  showWarning(): void {
    this.notificationService.showWarning('Advertencia');
  }
}
