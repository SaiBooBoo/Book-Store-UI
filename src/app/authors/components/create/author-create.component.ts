import { Component, inject } from "@angular/core";
import { FormBuilder, FormGroup, FormsModule, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthorService } from "../../services/author.service";
import { CommonModule } from "@angular/common";
import { NzButtonModule } from "ng-zorro-antd/button";
import { NzFormModule } from "ng-zorro-antd/form";
import { NzInputModule } from "ng-zorro-antd/input";
import { NzMessageService } from "ng-zorro-antd/message";
import { Router } from "@angular/router";



@Component({
    selector: 'app-author-create',
    templateUrl: './author-create.component.html',
    standalone: true,
    imports: [
        ReactiveFormsModule, NzFormModule, CommonModule, FormsModule, NzFormModule, NzInputModule, NzButtonModule
    ]
})
export class AuthorCreateComponent {

    form: FormGroup;
    errors: Record<string, string> = {};


    constructor(
    private fb: FormBuilder,
    private authorService: AuthorService,
    private message: NzMessageService,
    private router: Router
  ) {
    this.form = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      bio: ['']
    });
  }

   submit(): void {
    this.errors = {}; // reset previous errors
    if (this.form.invalid) {
        this.message.error('Please fill in all required fields correctly.');
      return;
    }

  
    this.authorService.createAuthor(this.form.value).subscribe({
      next: (res) => {
        this.message.success('Author created successfully');
        this.form.reset();
      },
      error: (err) => {
        if (err.status === 400 && err.error){
        this.errors = err.error;
      } else {
        this.message.error(err.error?.error || 'An error occurred while creating the author');
      }}
    });
  }

  cancel() {
    this.router.navigate(['/admin/authors']);
  }
}