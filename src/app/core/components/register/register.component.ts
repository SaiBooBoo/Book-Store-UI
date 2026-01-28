import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    FormBuilder,
    FormGroup,
    Validators,
    ReactiveFormsModule
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
        if (this.registerForm.invalid) {
            this.registerForm.markAllAsTouched();
            return;
        }
        setTimeout(() => {
            this.loading = true;
        });

        const { confirmPassword, ...payload } = this.registerForm.value;

        this.authService.register(payload).subscribe({
            next: () => {
                this.message.success('Registration successful. Please log in.');
                this.router.navigate(['/login']);
            },
            error: (err) => {
                if (err.status === 400 && err.error) {
                    this.mapBackendErrors(err.error);
                } else {
                    this.message.error('Registration failed');
                }
                this.loading = false;
            }
        });
    }

    private passwordMatchValidator(form: FormGroup) {
        const password = form.get('password')?.value;
        const confirm = form.get('confirmPassword')?.value;

        return password === confirm ? null : { passwordMatchValidator: true };
    }

    private mapBackendErrors(errors: any): void {
        Object.keys(errors).forEach(field => {
            const control = this.registerForm.get(field);
            if (control) {
                control.setErrors({ backend: errors[field] });
            }
        })
    }
}
