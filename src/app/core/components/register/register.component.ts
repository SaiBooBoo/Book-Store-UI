import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    FormBuilder,
    FormGroup,
    Validators,
    ReactiveFormsModule,
    FormsModule,
    ValidatorFn,
    AbstractControl,
    ValidationErrors
} from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-register',
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
    templateUrl: './register.component.html'
})
export class RegisterComponent {

    registerForm: FormGroup;
    loading = false;
    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router,
        private message: NzMessageService,
        private cdr: ChangeDetectorRef
    ) {
        this.registerForm = this.fb.group({
            username: ['', [Validators.required, Validators.minLength(4)]],
            password: ['', [Validators.required, Validators.minLength(6)]],
            confirmPassword: ['', Validators.required]
        }, {
            validators: this.passwordMatchValidator
        });
    }

    error: any = {};

    submit(): void {
        this.trimFormValues();

        if (this.registerForm.invalid) {
            this.registerForm.markAllAsTouched();
            return;
        }

        this.loading = true;

        const payload = {
            username: this.registerForm.value.username,
            password: this.registerForm.value.password
        };

        this.authService.register(payload).subscribe({
            next: () => {
                this.message.success('Registration successful. Please log in.');
                this.loading = false;

                this.cdr.detectChanges();
                setTimeout(() => {
                    this.router.navigate(['/auth/login']);
                }, 1000)

            },
            error: err => {
                if (err.status === 400 && err.error) {
                    this.mapBackendErrors(err.error);
                } else {
                    this.message.error('Registration failed');
                }
                this.loading = false;
                this.cdr.detectChanges();

            }
        });
    }

    private passwordMatchValidator: ValidatorFn = (form: AbstractControl): ValidationErrors | null => { // what does this line trying to suggest

        const password = form.get('password');
        const confirm = form.get('confirmPassword');

        if (!password || !confirm) return null;

        if (password.value !== confirm.value) {
            confirm.setErrors({ passwordMismatch: true });
            return null;
        }

        if (confirm.hasError('passwordMismatch')) {
            confirm.setErrors(null);
        }
        return null;
    }

    private mapBackendErrors(errors: any): void {
        Object.keys(errors).forEach(field => {
            this.registerForm.get(field)?.setErrors({
                backend: errors[field]
            });
        });
    }

    private trimFormValues(): void {
        Object.keys(this.registerForm.controls).forEach(key => {
            const control = this.registerForm.get(key);
            if (control && typeof control.value === 'string') {
                control.setValue(control.value.trim(), { emitEvent: false });
            }
        })
    }
}
