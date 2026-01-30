import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, map, Observable, tap } from "rxjs";
import { AuthResponse, LoginRequest, RegisterRequest } from "../components/models/auth.model";
import { jwtDecode } from "jwt-decode";
import { Router } from "@angular/router";
import { UndoService } from "./auth.undoService";
import { log } from "ng-zorro-antd/core/logger";


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly API_URL = 'http://localhost:8080/api/auth';
  private readonly TOKEN_KEY = 'auth_token';

  
  constructor(private http: HttpClient,
private router: Router,
private undoService: UndoService
  ) { }

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(
    this.hasToken()
  );

  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${this.API_URL}/login`,
      request
    ).pipe(
      tap(response => {
        this.storeToken(response.token);
        this.isAuthenticatedSubject.next(true);
        this.roleSubject.next(this.getUserRole());
      })
    );
  }


  register(request: RegisterRequest): Observable<void> {
    return this.http.post<void>(
      `${this.API_URL}/register`,
      request
    );
  }

  private roleSubject = new BehaviorSubject<string | null>(this.getUserRole());
  role$ = this.roleSubject.asObservable();

  
  isAdmin$ = this.role$.pipe(
  map(role => role === 'ADMIN')
);

  logout(): void {
    console.log('Logout is working');
    
    this.isAuthenticatedSubject.next(false);
    this.roleSubject.next(null);

    localStorage.removeItem('auth_token');
    // localStorage.clear();
    this.undoService.clearHistory();

    this.router.navigateByUrl('/auth/login');
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  private storeToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  private clearToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem('item');
    sessionStorage.clear();
  }

  private hasToken(): boolean {
    return !!this.getToken();
  }


  public getUserRole(): string | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const decoded = jwtDecode<JwtPayload>(token);

      return decoded.role
        ?? decoded.roles?.[0]
        ?? null;
    } catch {
      return null;
    }
  }

  isAdmin(): boolean {
    return this.getUserRole() === "ADMIN";
  }

  isUser(): boolean {
    return this.getUserRole() === "USER";
  }

  private isTokenExpired(token: string): boolean {
    const decoded: any = jwtDecode(token);
    return decoded.exp * 1000 < Date.now();
  }
}

export interface JwtPayload {
  sub: string;
  role?: string;
  roles?: string[];
}
