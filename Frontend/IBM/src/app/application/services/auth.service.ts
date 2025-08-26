import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { LocalStorageService } from './local-storage.service';
import { environment } from '../../../environments/environment';
import { AuthResponse, TokenInfo } from '../dtos/response/auth.Response.dto';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  private readonly TOKEN_KEY = 'auth_token';
  //private readonly API_URL = `${environment.apiUrl}/api/auth`; // Usar la URL completa del endpoint de autenticación
  private readonly API_URL = '/api/auth';
  
  constructor(
    private localStorageService: LocalStorageService,
    private http: HttpClient
  ) {
    this.initializeAuthState();
  }

  private initializeAuthState(): void {
    const token = this.localStorageService.getItem(this.TOKEN_KEY);
    this.isAuthenticatedSubject.next(!!token);
  }

  login(username: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/login`, { username, password }).pipe(
      tap((response: any) => {
        console.log("Respuesta del servicio de autenticación: ", response);
        if (response.data.token && response.data.user_information) {
          const login_response: AuthResponse = {
            token: response.data.token,
            userInformation: response.data.user_information
          };
          console.log("login_response : " + JSON.stringify(login_response))
          this.localStorageService.setItem(this.TOKEN_KEY, login_response);
        }
        this.isAuthenticatedSubject.next(!!response.data.token);
      }),
      catchError(this.handleError)
    );
  }

  logout(): void {
    this.localStorageService.removeItem(this.TOKEN_KEY);
    this.isAuthenticatedSubject.next(false);
  }

  isAuthenticated(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }

  isAuthenticatedSync(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Ocurrió un error desconocido';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error del cliente: ${error.error.message}`;
    } else {
      errorMessage = `Error del servidor: Código ${error.status}, Mensaje: ${error.message}`;
    }

    console.error("Detalles del error: ", error);
    return throwError(() => new Error(errorMessage));
  }
}
