import { Component, inject, OnDestroy, OnInit } from "@angular/core";
import {
    NonNullableFormBuilder,
    ReactiveFormsModule,
    Validators
 } from "@angular/forms";
import {HttpClient} from '@angular/common/http';
 
import { NzButtonModule } from "ng-zorro-antd/button";
import { NzCheckboxModule } from "ng-zorro-antd/checkbox";
import { NzFormModule} from "ng-zorro-antd/form";
import { NzInputModule } from "ng-zorro-antd/input";
import { NzSelectModule } from "ng-zorro-antd/select";
import { Author } from "../../../authors/models/author.model";
import { Router } from "@angular/router";
import { CommonModule } from "@angular/common";
import { NzMessageService } from 'ng-zorro-antd/message';
import { BookService } from "../../service/book.service";



@Component({
    selector: 'app-book-create',
    templateUrl: './book-create.component.html',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        CommonModule,
        NzFormModule,
        NzInputModule,
        NzButtonModule,
        NzSelectModule,
        NzCheckboxModule,
    ]
})
export class BookCreateComponent {
    
    public GET_ALL_AUTHORS_URL = "http://localhost:8080/api/admin/authors/all";
   
    private fb = inject(NonNullableFormBuilder);
    private http = inject(HttpClient);
    private router = inject(Router);
    private bookService = inject(BookService);
    private message = inject(NzMessageService);

    authors: Author[] = [];
    authorLoading = false;


    ngOnInit(): void {
        this.resetForm
        this.http.get<Author[]>(this.GET_ALL_AUTHORS_URL)
        .subscribe(data => this.authors = data);
        this.loadAuthors();
    }

    loadAuthors(): void {
        this.http.get<Author[]>(this.GET_ALL_AUTHORS_URL)
        .subscribe({
            next: data => {
                this.authors = data;
                this.authorLoading = false;
            },
            error: err => {
                this.authorLoading = false;
            }
    });
    }

    validateForm = this.fb.group({
        title: this.fb.control('', [Validators.required]),
        authorId: this.fb.control<number | null>(null, Validators.required),
        isbn: this.fb.control('', [Validators.required]),
        price: this.fb.control(0, [Validators.required, Validators.min(1)]),
        stock: this.fb.control(0, [Validators.required, Validators.min(0)]),
        description: this.fb.control(''),
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

        this.bookService.createBook(payload).subscribe({
            next: () => {
                this.message.success('Book created successfully', {nzDuration: 4000})
                this.validateForm.reset({price: 0, stock: 0});
                this.router.navigate(['/admin/books']);
            },
            error: () => {
               this.message.error('Failed to create book');
            },
        })
    }

    resetForm(): void {
        this.validateForm.reset({
            price: 0,
            stock: 0
        })
    }

    cancel(): void {
        this.router.navigate(['/admin/books']);
    }
}
