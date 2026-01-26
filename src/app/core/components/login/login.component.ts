import { Component, inject } from "@angular/core";
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { CommonModule } from "@angular/common";
import { NzFormModule } from "ng-zorro-antd/form";
import { NzInputModule } from "ng-zorro-antd/input";
import { NzButtonModule } from "ng-zorro-antd/button";
import { NzSelectModule } from "ng-zorro-antd/select";
import { NzCheckboxModule } from "ng-zorro-antd/checkbox";
import { NzCardModule } from "ng-zorro-antd/card";
import { NzGridModule } from "ng-zorro-antd/grid";
import { AuthService } from "../../services/auth.service";

@Component({
    selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: true,
  imports: [ ReactiveFormsModule,
        CommonModule,
        NzFormModule,
        NzInputModule,
        NzButtonModule,
        NzSelectModule,
        NzCheckboxModule,
        NzCardModule,
        NzGridModule,]
      })
export class LoginComponent {
    private fb = inject(NonNullableFormBuilder)
    private authService = inject(AuthService);
    private router = inject(Router);

    loginForm = this.fb.group({
        username: this.fb.control('', Validators.required),
        password: this.fb.control('', Validators.required)
    }); submit(): void {
    this.authService.login(
    this.loginForm.value.username!,
    this.loginForm.value.password!
  ).subscribe({
    next: () => {
      console.log('Authenticated');
      this.router.navigate(['/admin/books']);
    },
    error: () => {
        console.log("Invalid username or password")
    }
  });

}}
