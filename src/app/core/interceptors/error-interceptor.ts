import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 0) {
        console.error('Network error: check your internet connection');
      } else if (error.status === 401 && !req.url.includes('signin')) {
        localStorage.removeItem('token');
        router.navigate(['/auth/login']);
      } else if (error.status === 403) {
        console.error('Forbidden:', error.error?.message);
      } else if (error.status === 404) {
        console.error('Not found:', req.url);
      } else if (error.status >= 500) {
        console.error('Server error, try again later');
      }

      return throwError(() => error);
    }),
  );
};
