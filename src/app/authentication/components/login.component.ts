import { inject } from "@angular/core";
import { NonNullableFormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "../service/auth.service";

export class LoginComponent {
    private fb = inject(NonNullableFormBuilder)
    private authService = inject(AuthService);
    private router = inject(Router);

    loginForm = this.fb.group({
        username: this.fb.control('', [Validators.required, Validators.username]),
        password: this.fb.control('', Validators.required)
    });

    submit(): void {
        if (this.loginForm.invalid) {
            Object.values(this.loginForm.controls).forEach( c => {
                c.markAsDirty();
                c.updateValueAndValidity();
            });
            return;
        }

        this.authService.login(this.loginForm.value).subscribe({
            next: () => {
                this.router.navigate(['/admin/books']);
            },
            error: () => {
                // change to display message module from ng zorro
                alert('Invalid crecentials');
            }
        })
    }

}