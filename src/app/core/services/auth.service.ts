import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable ,tap} from "rxjs";
import { AuthResponse, LoginRequest, RegisterRequest } from "../components/models/auth.model";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly API_URL = 'http://localhost:8080/api/auth';
  private readonly TOKEN_KEY = 'auth_token';

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(
    this.hasToken()
  );

   isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private http: HttpClient) {}

 login(request: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${this.API_URL}/login`,
      request
    ).pipe(
      tap(response => {
        this.storeToken(response.token);
        this.isAuthenticatedSubject.next(true);
      })
    );
  }

 register(request: RegisterRequest): Observable<void> {
    return this.http.post<void>(
      `${this.API_URL}/register`,
      request
    );
  }

  logout(): void {
    this.clearToken();
    this.isAuthenticatedSubject.next(false);
  }


  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  private storeToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  private clearToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  private hasToken(): boolean {
    return !!this.getToken();
  }
}