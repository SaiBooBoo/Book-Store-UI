import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";


@Injectable({ providedIn: 'root'})
export class AuthService {

    private readonly API = 'http://localhost:8080/api/auth/login';

    constructor(private http: HttpClient) {}

    login(credentials: {username: string, password: string}) {
        return this.http.post<any>(this.API, credentials).pipe(
            tap(user => {
                localStorage.setItem('user', JSON.stringify(user));
            })
        );
    }

    logout(): void {
        localStorage.removeItem('user');
    }

    isAuthenticated(): boolean {
        return !!localStorage.getItem('user');
    }

    getUser(): any {
        return JSON.parse(localStorage.getItem('user')!);
    }
    

}