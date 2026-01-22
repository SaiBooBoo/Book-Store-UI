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

    authors : Author[] = [];
    authorLoading = false;
    bookForm!: FormGroup;
    submitting  = false;
    bookId!: number;

    ngOnInit(): void {
        this.bookId = Number(this.route.snapshot.paramMap.get('id'));
       this.initForm();
        this.loadAuthors();
        this.loadBook();
    }

    private loadAuthors(): void {
        this.http.get<Author[]>(this.GET_ALL_AUTHORS_URL)
        .subscribe({
            next: data => {
                this.authors = data,
                this.authorLoading = false;
            },
            error: err => {
                this.authorLoading = false;
            }
        });
    }

    private initForm(): void {
        this.bookForm = this.fb.group({
        title: ['', [Validators.required]],
        author: ['', [Validators.required]],
        isbn: ['', [Validators.required]],
        price: [0, [Validators.required]],
        stock: [0, [Validators.required]],
        description: ['']
    })
    }

    private loadBook(): void {
        this.bookService.getBookById(this.bookId).subscribe({
            next: (book) => {
                this.bookForm.patchValue({
                    title: book.title,
                    author: book.author?.id,
                    isbn: book.isbn,
                    price: book.price,
                    stock: book.stock,
                    description: book.description
                });
                this.message.success("Book updated successfully");
            },
            error: err => {
                this.message.error('Failed to load book');
                this.submitting = false;
            }
        })
    }

    
    submitForm(): void {
        if(this.bookForm.invalid){
            this.bookForm.markAllAsTouched();
            return;
        }
       
        this.submitting = true;

        this.bookService.updateBook(this.bookId, this.bookForm.value).subscribe({
            next: () => {
                this.message.success('Book updated successfully')
                this.router.navigate(['/admin/books']);
            },
            error: () => {
                this.submitting = false;
                this.message.error('Failed to update book');
            }
        })
    }

    resetform(): void {
        this.bookForm.reset({
            price: 0,
            stock: 0
        })
    }

    cancel(): void {
        this.router.navigate(['admin/books'])
    }

   
  
}


