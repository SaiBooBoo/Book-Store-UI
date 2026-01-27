import { Component, inject, OnInit } from '@angular/core';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
  FormGroup
} from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzMessageService } from 'ng-zorro-antd/message';

import { AuthService } from '../../services/auth.service';
import { applyServerErrors } from '../../../shared/components/utils/apply-server-errors.util';
import { finalize, take } from 'rxjs/operators';

interface LoginResponse {
  // backend may return either a user DTO, or a wrapper with fieldErrors
  user?: any;
  fieldErrors?: Record<string, string>;
  message?: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzCardModule,
    NzGridModule
  ]
})
export class LoginComponent implements OnInit {
  private fb = inject(NonNullableFormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private message = inject(NzMessageService);

  loginForm!: FormGroup;
  submitting = false;

  ngOnInit(): void {
    this.loginForm = this.fb.group({

      username: this.fb.control('', { validators: [Validators.required] }),
      password: this.fb.control('', { validators: [Validators.required] })
    });
  }

  submit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.loginForm.updateValueAndValidity();
      return;
    }

    this.submitting = true;

    const { username, password } = this.loginForm.value as { username: string; password: string };

    this.authService.login(username, password)
      .pipe(
        take(1),
        finalize(() => (this.submitting = false))
      )
      .subscribe({
        next: (res: LoginResponse | any) => {
          // If backend returns fieldErrors inside body, show them inline
          if (res?.fieldErrors) {
            applyServerErrors(this.loginForm, res.fieldErrors);
            // do not proceed to success navigation
            return;
          }

          // Optionally: if backend returns user or token, store and mark logged in
          if (res?.user) {
            localStorage.setItem('user', JSON.stringify(res.user));
          }

          this.message.success('Logged in successfully');
          this.router.navigate(['/admin/authors']);
        },
        error: (err: any) => {
          // Server returned non-2xx (e.g. 401): show friendly message
          this.handleError(err);
        }
      });
  }

  private handleError(err: any): void {
    const status = err?.status;
    const errorBody = err?.error;

    // fieldErrors in a non-200 error (legacy) — map them
    if (status === 400 && errorBody?.fieldErrors) {
      applyServerErrors(this.loginForm, errorBody.fieldErrors);
      return;
    }

    // common: bad credentials
    if (status === 401) {
      // Put a generic server error on the form (do not reveal which field)
      const msg = errorBody?.message || 'Invalid username or password';
      // apply as a password-level message to avoid leaking username existence
      const pwdControl = this.loginForm.get('password');
      if (pwdControl) {
        pwdControl.setErrors({ serverError: msg });
      } else {
        this.message.error(msg);
      }
      return;
    }

    const fallback = errorBody?.message || 'Login failed. Please try again.';
    this.message.error(fallback);
    console.error('Login error', err);
  }
}
