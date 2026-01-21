import { Component, OnInit, inject } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';

import { AuthorService } from '../../services/author.service';
import { catchError, debounceTime, map, of, switchMap } from 'rxjs';
import { NzFormModule } from 'ng-zorro-antd/form';
import { CommonModule } from '@angular/common';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';



@Component({
    selector: 'app-author-update',
    standalone: true,
    templateUrl: './author-update.component.html',
    imports: [CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NzFormModule,
        NzInputModule,
        NzButtonModule,]
})
export class AuthorUpdateComponent implements OnInit {

    private fb = inject(FormBuilder);
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private message = inject(NzMessageService);
    private authorService = inject(AuthorService);

    authorForm!: FormGroup;
    submitting = false;
    authorId!: number;
    originalEmail!: string;

    ngOnInit(): void {
        this.authorId = Number(this.route.snapshot.paramMap.get('id'));
        this.initForm();
        this.loadAuthor();
    }

    private initForm(): void {
        this.authorForm = this.fb.group({
            firstName: ['', [Validators.required, Validators.maxLength(50)]],
            lastName: ['', [Validators.required, Validators.maxLength(50)]],
            email: ['', [Validators.required, Validators.email]],
            bio: ['', [Validators.maxLength(500)]]
        })
    }

    private loadAuthor(): void {
        this.authorService.getAuthorById(this.authorId).subscribe({
            next: (author) => { 
                 this.originalEmail = author.email;

            this.authorForm.patchValue({
                firstName: author.firstName,
                lastName: author.lastName,
                email: author.email,
                bio: author.bio
            });

            this.authorForm.get('email')?.setAsyncValidators(
                this.emailDuplicateValidatorForUpdate()
            );
            this.authorForm.get('email')?.updateValueAndValidity({ onlySelf: true, emitEvent: false});
            },
            error: (err) => {
                console.error('Failed to load author', err);
                this.message.error('Failed to load author');
            }
           
        })
    }

    submit(): void {
        if (this.authorForm.invalid) {
            this.authorForm.markAllAsTouched();
            return;
        }

        this.submitting = true;

        this.authorService.updateAuthor(this.authorId, this.authorForm.value)
            .subscribe({
                next: () => {
                    this.message.success('Author updated successfully');
                    this.router.navigate(['/admin/authors']);
                },
                error: err => {
                    this.submitting = false;
                    this.handleError(err);
                }
            });
    }

    private handleError(err: any): void {
        if (err.status === 409) {
            this.authorForm.get('email')
                ?.setErrors({ duplicate: err.error?.message || 'Email already exists' });
        } else {
      this.message.error('An unexpected error occurred');
      console.error(err);
    }
    }

    cancel(): void {
        this.router.navigate(['/admin/authors'])
    }

    emailDuplicateValidatorForUpdate(): AsyncValidatorFn {
        return (control: AbstractControl) => {

            if (!control.value || control.value === this.originalEmail) {
                return of(null);
            }

            return of(control.value).pipe(
                debounceTime(500),
                switchMap(email => this.authorService.checkEmailExists(email, this.authorId)),
                map(exists => exists ? { duplicate: 'This email is already registered' } : null),
                catchError(() => of(null))
            )
        }
    }
}

