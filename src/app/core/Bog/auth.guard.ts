import { inject, Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  UrlTree,
  CanActivateChild
} from '@angular/router';
import { AuthService } from '../services/auth.service';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild{

  constructor(
    private router: Router
  ) { }
  private authService = inject(AuthService);

  

  canActivate(): boolean | UrlTree {
    return this.checkAuth();
  }


  canActivateChild(): boolean | UrlTree {
    return this.checkAuth();
  }

   private checkAuth(): boolean | UrlTree {

    const token = this.authService.getToken();

    if (!token || this.isTokenExpired(token)) {

      // this.authService.logout();

      return this.router.createUrlTree(['/auth/login']);
    }

    return true;
  }

  private isTokenExpired(token: string): boolean {

    try {
      const decoded: any = jwtDecode(token);

      return decoded.exp * 1000 < Date.now();

    } catch {
      return true; // invalid token = treat as expired
    }
  }
}


