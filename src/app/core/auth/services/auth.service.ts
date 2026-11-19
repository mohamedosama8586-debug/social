import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { readonly } from '@angular/forms/signals';
import { Router } from '@angular/router';

@Service()
export class AuthService {
  private readonly httpClient = inject(HttpClient);
  private readonly router = inject(Router);
  signUp(data: object): Observable<any> {
    return this.httpClient.post(environment.baseUrl + `users/signup`, data);
  }
  signIn(data: object): Observable<any> {
    return this.httpClient.post(environment.baseUrl + `users/signin`, data);
  }

  logOut(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/auth/login']);
  }
}
