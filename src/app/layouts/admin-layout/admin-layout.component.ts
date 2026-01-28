import { Component, OnInit } from "@angular/core";
import { NzPageHeaderModule } from "ng-zorro-antd/page-header";
import { NzTabsModule } from 'ng-zorro-antd/tabs'; 
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzButtonComponent, NzButtonModule } from "ng-zorro-antd/button";
import { Observable } from "rxjs";
import { AuthService } from "../../core/services/auth.service";
import { CommonModule } from "@angular/common";

@Component({
    standalone: true,
    selector: 'app-admin-layout',
    templateUrl: './admin-layout.component.html',
    styleUrls: ['./admin-layout.component.css'],
    imports: [
    NzPageHeaderModule,
    NzTabsModule,
    RouterModule,
    RouterOutlet,
    NzIconModule,
    NzMenuModule,
    NzLayoutModule,
    NzButtonModule,
    CommonModule
]
})
export class AdminLayoutComponent implements OnInit  {
    collapsed = false;

    isAuthenticated$!: Observable<boolean>;

    constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.isAuthenticated$ = this.authService.isAuthenticated$;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

}