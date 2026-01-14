import { Component, inject } from "@angular/core";
import { NonNullableFormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "../service/auth.service";

@Component({

})
export class LoginComponent {
    private fb = inject(NonNullableFormBuilder)
    private authService = inject(AuthService);
    private router = inject(Router);

    loginForm = this.fb.group({
        username: this.fb.control('', Validators.required),
        password: this.fb.control('', Validators.required)
    });

    submit(): void {
         this.authService.login(
    this.loginForm.value.username!,
    this.loginForm.value.password!
  ).subscribe({
    next: () => {
      console.log('Authenticated');
      this.router.navigate(['/dashboard']);
    },
    error: () => {
        console.log("Invalid username or password")
    }
  });
    }

}