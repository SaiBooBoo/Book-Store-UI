import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AuthService } from '../../services/auth.service';;


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    RouterLink
],
  templateUrl: './login.component.html'
})
export class LoginComponent {

  loginForm: FormGroup;
  loading = false;
  returnUrl = '/';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private message: NzMessageService,
    private cdr: ChangeDetectorRef
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

     this.returnUrl =
      this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  submit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.cdr.detectChanges();
    this.loading = true;

    this.authService.login(this.loginForm.value).subscribe({
      next: () => {
        this.message.success('Login successful');

    
          this.router.navigateByUrl('/admin/books');
        
        
      },
      error: (err) => {
        if (err.status === 401) {
          this.message.error('Invalid username or password');
        } else {
          this.message.error('Login failed');
        }
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  toRegister() : void {
    this.router.navigateByUrl('http://localhost:4200/auth/register');
  }
}