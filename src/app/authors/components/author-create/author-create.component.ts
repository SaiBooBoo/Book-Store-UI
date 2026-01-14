import { Component, inject } from "@angular/core";
import { FormBuilder, FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthorService } from "../../services/author.service";
import { Author } from "../../models/author.model";
import { CommonModule } from "@angular/common";
import { NzButtonModule } from "ng-zorro-antd/button";
import { NzFormModule } from "ng-zorro-antd/form";
import { NzInputModule } from "ng-zorro-antd/input";
import { Router } from "@angular/router";
import { NzMessageService } from "ng-zorro-antd/message";


@Component({
    selector: 'app-author-create',
    templateUrl: './author-create.component.html',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        NzFormModule,
        NzButtonModule,
        NzInputModule,
            ]
})
export class AuthorCreateComponent {
   
    private fb = inject(NonNullableFormBuilder);
    private router = inject(Router);
    private authorService = inject(AuthorService);
    private message = inject(NzMessageService);

    // fN, lN, email, dob, bio
    validateForm = this.fb.group({
        firstName: this.fb.control('', [Validators.required]),
        lastName: this.fb.control('', [Validators.required]),
        email: this.fb.control('', [Validators.required]),
        dateOfBirth: this.fb.control('')
    })

    submitForm(): void {
        if(this.validateForm.invalid) {
            Object.values(this.validateForm.controls).forEach(control => {
                control.markAsDirty();
                control.updateValueAndValidity({ onlySelf: true});
            });
            return;
        }

        const payload = this.validateForm.value;

        this.authorService.createAuthor(payload).subscribe({
            next: () => {
                this.message.success('Author created successfully', {nzDuration: 4000})
                this.validateForm.reset({});
            },
            error: err => {
                this.message.error('Failed to create new Author');
            }
        })
    }

    resetForm(): void {
        this.validateForm.reset({});
    }
    
    cancel(): void {
        this.router.navigate(['/admin/authors']);
    }
}