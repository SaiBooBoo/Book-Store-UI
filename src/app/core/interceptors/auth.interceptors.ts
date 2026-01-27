import {
  HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

     constructor(private auth: AuthService, private router: Router) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.auth.getToken();
    let authReq = req;

    if (token && !this.auth.isTokenExpired(token)) {
      authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }return next.handle(authReq).pipe(
      catchError((err: HttpErrorResponse) => {
        // If token expired or unauthorized, logout and redirect to login
        if (err.status === 401 || err.status === 403) {
          // optionally check: if route is /api/auth/** then skip
          this.auth.logout(true);
        }
        return throwError(() => err);
      })
    );
  }
}