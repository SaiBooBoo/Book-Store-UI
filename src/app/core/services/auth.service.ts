import { HttpClient } from "@angular/common/http";
import { Injectable, signal } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, Observable } from "rxjs";
import { JwtResponse, LoginRequest } from "../components/models/auth.model";
import { tap } from 'rxjs/operators';


const TOKEN_KEY = 'auth_token';

@Injectable({ providedIn: 'root'})
export class AuthService {

    private baseUrl  = 'http://localhost:8080/api/auth';
    private authState  = new BehaviorSubject<boolean>(this.hasValidToken());

   authState$: Observable<boolean> = this.authState.asObservable();

   constructor(private http: HttpClient, private router: Router) {}

   login(username: string, password: string): Observable<JwtResponse> {
    const body: LoginRequest = { username, password };
    return this.http.post<JwtResponse>(`${this.baseUrl}/login`, body).pipe(
      tap(res => {
        if (res?.token) {
          this.storeToken(res.token);
          this.authState.next(true);
        }
      })
    )
   }

   logout(redirectToLogin = true) {
    this.removeToken();
    this.authState.next(false);
    if (redirectToLogin) {
      this.router.navigate(['/login']);
    }
  }

  storeToken(token: string) {
    localStorage.setItem(TOKEN_KEY, token);
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  removeToken() {
    localStorage.removeItem(TOKEN_KEY);
  }

  private decodePayload(token: string) {
    try {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload));
    } catch {
      return null;
    }
  }

   getTokenExpirationDate(token?: string): Date | null {
    const t = token ?? this.getToken();
    if (!t) return null;
    const payload = this.decodePayload(t);
    if (!payload || !payload.exp) return null;
    // exp is usually in seconds
    const date = new Date(0);
    date.setUTCSeconds(payload.exp);
    return date;
  }

  isTokenExpired(token?: string): boolean {
    const exp = this.getTokenExpirationDate(token);
    if (!exp) return true;
    return exp.getTime() < Date.now();
  }

  hasValidToken(): boolean {
    const t = this.getToken();
    return !!t && !this.isTokenExpired(t);
  }


}