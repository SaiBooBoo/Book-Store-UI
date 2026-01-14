import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";


@Injectable({ providedIn: 'root'})
export class AuthService {

    private readonly LOGIN_URL  = 'http://localhost:8080/api/auth/login';

    constructor(private http: HttpClient) {}

    login(username: string, password: string) {
    const body = new URLSearchParams();
    body.set('username', username);
    body.set('password', password);

    return this.http.post(
      this.LOGIN_URL,
      body.toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        withCredentials: true // IMPORTANT
      }
    );
    }

    logout(): void {
        localStorage.removeItem('user');
    }

    isAuthenticated(): boolean {
        return document.cookie.includes('JSESSIONID')

    }

    getUser(): any {
        return JSON.parse(localStorage.getItem('user')!);
    }
    


}