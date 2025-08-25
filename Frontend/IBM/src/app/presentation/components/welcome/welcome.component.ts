import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AuthService } from '../../../application/services/auth.service';
import { LocalStorageService } from 'src/app/application/services/local-storage.service';
import { AuthResponse, UserProfileResponseDto } from 'src/app/application/dtos/response/auth.Response.dto';


@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {
  constructor(
    private router: Router,
    private sanitizer: DomSanitizer,
    private authService: AuthService,
    private localStorageService: LocalStorageService
  ) { }

  public informationUser: UserProfileResponseDto = new UserProfileResponseDto();

  ngOnInit(): void {
    if (this.authService.isAuthenticatedSync()) {
      const informacion: AuthResponse = this.localStorageService.getItem("auth_token") ?? new AuthResponse();
      this.informationUser = {
        resultCode: 200,
        firstName: informacion.userInformation?.firstName,
        lastName: informacion.userInformation?.lastName,
        age: informacion.userInformation?.age,
        profilePhoto: informacion.userInformation?.profilePhoto,
        video: informacion.userInformation?.video
      };
    }


  }

  public getSafeVideoUrl(): SafeResourceUrl {
    const video = this.informationUser.video || '';
    let videoId = '';
    if (video.includes('/shorts/')) {
      videoId = video.split('/shorts/')[1]?.split('?')[0];
    } else if (video.includes('watch')) {
      videoId = new URLSearchParams(video.split('?')[1] || '').get('v') || '';
    }
    const url = videoId ? `https://www.youtube.com/embed/${videoId}` : (video || 'https://www.youtube.com/embed/dQw4w9WgXcQ');
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  public logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
