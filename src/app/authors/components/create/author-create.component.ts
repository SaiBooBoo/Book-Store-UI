import { Component, OnInit, inject } from "@angular/core";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from "@angular/router";
import { AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { map, catchError, debounceTime, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { NzMessageService } from "ng-zorro-antd/message";

import { AuthorService } from "../../services/author.service";
import { applyServerErrors } from "../../../shared/components/utils/apply-server-errors.util";
import { CommonModule } from "@angular/common";
import { NzFormModule } from "ng-zorro-antd/form";
import { NzInputModule } from "ng-zorro-antd/input";
import { NzButtonModule } from "ng-zorro-antd/button";

@Component({
  selector: 'app-author-create',
  standalone: true,
  templateUrl: './author-create.component.html',
  imports: [ CommonModule,
  FormsModule,
  ReactiveFormsModule, 
  NzFormModule,
  NzInputModule,
  NzButtonModule,]
})
export class AuthorCreateComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authorService = inject(AuthorService);
  private message = inject(NzMessageService);
  private router = inject(Router);

  authorForm!: FormGroup;
  submitting = false;

  ngOnInit(): void {
    this.authorForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.maxLength(50)]],
      lastName: ['', [Validators.required, Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email],
    [this.emailDuplicateValidator()]],
      bio: ['', [Validators.maxLength(500)]],
    });
  }

  submit(): void {
    if (this.authorForm.invalid) {
      this.authorForm.markAllAsTouched();
      this.authorForm.updateValueAndValidity();
      return;
    }

    this.submitting = true;
    this.clearServerErrors();

    this.authorService.createAuthor(this.authorForm.value).subscribe({
      next: () => {
        this.message.success('Author created successfully');
        this.router.navigate(['/admin/authors']);
      },
      error: (err) => {
        this.submitting = false;
        this.handleError(err);
      }
    });
  }

  /** Handle backend errors */
  private handleError(err: any): void {
    const { status, error } = err;

    if (status === 400 && error?.fieldErrors) {
      applyServerErrors(this.authorForm, error.fieldErrors);
    } 
    else if (status === 409) {
      // Email duplication
      this.authorForm.get('email')?.setErrors({ duplicate: error?.message || 'Email already exists' });
    } 
    else {
      console.error('Submission error', err);
    }
  }

  /** Remove server errors while editing */
  private clearServerErrors(): void {
    Object.values(this.authorForm.controls).forEach(control => {
      if (control.errors) {
        const { serverError, duplicate, ...rest } = control.errors;
        control.setErrors(Object.keys(rest).length ? rest : null);
      }
    });
  }

  emailDuplicateValidator(): AsyncValidatorFn {
  return (control: AbstractControl) => {
    if (!control.value) return of(null); 

    return of(control.value).pipe(
      debounceTime(500), 
      switchMap(email =>
        this.authorService.checkEmailExists(email) 
      ),
      map(exists => (exists ? { duplicate: 'This email is already registered' } : null)),
      catchError(() => of(null)) 
    );
  };
}

  cancel(): void {
    this.router.navigate(['/admin/authors']);
  }
}
