import { Component, inject, isStandalone, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { NzMessageService } from "ng-zorro-antd/message";
import { BookService } from "../../service/book.service";
import { CommonModule } from "@angular/common";
import { NzFormModule } from "ng-zorro-antd/form";
import { NzInputModule } from "ng-zorro-antd/input";
import { NzButtonModule } from "ng-zorro-antd/button";
import { NzSelectModule } from "ng-zorro-antd/select";
import { NzCheckboxModule } from "ng-zorro-antd/checkbox";
import { HttpClient } from "@angular/common/http";
import { Author } from "../../../authors/models/author.model";
import { ChangeDetectorRef } from "@angular/core";

@Component({
    selector: 'app-book-update',
    standalone: true,
    templateUrl: './book-update.component.html',
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
export class BookUpdateComponent implements OnInit {

    public GET_ALL_AUTHORS_URL = "http://localhost:8080/api/admin/authors/all";
    
    private fb = inject(FormBuilder);
    private route = inject(ActivatedRoute)
    private http = inject(HttpClient);
    private router = inject(Router);
    private message = inject(NzMessageService)
    private bookService = inject(BookService);
    private cdr = inject(ChangeDetectorRef);

    authors: Author[] = [];
    authorLoading = false;
    submitting = false;
    loadingBook = false;
    bookId!: number;
    bookForm!: FormGroup;


    ngOnInit(): void {
        this.bookId = Number(this.route.snapshot.paramMap.get('id'));
        this.initForm();
        this.loadAuthors();
        this.loadBook();
    }

    private initForm(): void {
        this.bookForm = this.fb.group({
            title: ['', [Validators.required]],
            authorId: ['', [Validators.required]],
            isbn: ['', [Validators.required]],
            price: [0, [Validators.required, Validators.min(1)]],
            stock: [0, [Validators.required, Validators.min(0)]],
            description: ['', [Validators.maxLength(1000)]]
        })
    }

    private loadAuthors(): void {
        this.http.get<Author[]>(this.GET_ALL_AUTHORS_URL)
            .subscribe({
                next: data => {
                    this.authors = data,
                        this.authorLoading = false;
                        this.cdr.detectChanges();
                },
                error: err => {
                    this.authorLoading = false;
                    this.message.error('Failed to load authors');
                }
            });
    }

    private loadBook(): void {
        this.loadingBook = true;
        this.bookService.getBookById(this.bookId).subscribe({
            next: (book) => {
                this.bookForm.patchValue({
                    title: book.title,
                    authorId: Number(book.authorId),
                    isbn: book.isbn,
                    price: book.price,
                    stock: book.stock,
                    description: book.description
                });
                this.loadingBook = false;
            },
            error: err => {
                this.loadingBook = false;
                this.message.error('Failed to load book');
            }
        })
    }


    submitForm(): void {
        if (this.bookForm.invalid) {
            Object.values(this.bookForm.controls).forEach(control => {
                if(control.invalid){
                    control.markAsDirty();
                    control.updateValueAndValidity({ onlySelf: true});
                }
            });
            return;
        }

        this.submitting = true;

        const updateData = {
            ...this.bookForm.value,
            id: this.bookId
        };

        this.bookService.updateBook(this.bookId, updateData).subscribe({
            next: () => {
                this.message.success('Book updated successfully')
                this.router.navigate(['/admin/books']);
            },
            error: (err) => {
                console.error(err);
                this.submitting = false;
                this.message.error('Failed to update book');
            }
        })
    }

    resetform(): void {
        Object.keys(this.bookForm.controls).forEach(key => {

            const control = this.bookForm.get(key);
            
            if (control?.dirty) {

                control.reset();

                if (key === 'price' || key === 'stock') {
                    control.reset(0);
                }
            }
        })
    }

    cancel(): void {
        this.router.navigate(['admin/books'])
    }
}


