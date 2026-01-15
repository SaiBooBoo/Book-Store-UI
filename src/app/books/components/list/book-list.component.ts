import { Component, OnInit } from "@angular/core";
import { CommonModule } from '@angular/common';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { Router } from "@angular/router";


import { Book } from "../../model/book.model";
import { NzIconDirective } from "ng-zorro-antd/icon";
import { BookService } from "../../service/book.service";



@Component({
    selector: 'app-book-list',
    standalone: true,
    imports: [CommonModule, NzTableModule, NzButtonModule, NzPaginationModule,
        NzIconDirective, NzIconModule, NzDividerModule],
    templateUrl: './book-list.component.html',
    styleUrl: 'book.list.component.css'
})
export class BookListComponent implements OnInit {

    books: Book[] = [];

    totalElements = 0;
    pageSize = 10;
    pageIndex = 1;

    isLoading = false;

    constructor(
        private bookService: BookService,
        private router : Router) {}

    ngOnInit(): void {
        this.loadBooks();
    }

    loadBooks(): void {
        this.isLoading = true;

        const backendPage = this.pageIndex - 1;
        // const datatableInput = {
        //     pageIndex: ;

        //     pageSize: ;

        //     sortField: string | null;

        //     sortOrder: string | null;

        //     queryCriteria?: {

        //     };

        //     searchValue?: string | null;
        // }



        this.bookService.getBooks(backendPage).subscribe({
            next: (data) => {
                this.books = data.content;
                this.totalElements = data.page.totalElements;
                this.pageSize = data.page.size;
                
            },
            error: () => {
                this.isLoading = false;
            },
            complete: () => {
                this.isLoading = false;
            }
        });
    }

    onPageChange(pageIndex: number): void {
        this.pageIndex = pageIndex;
        this.loadBooks();
    }

    onPageSizeChange(size : number):void {
        this.pageSize = size;
        this.pageIndex =  1;
        this.loadBooks();
    }

    navigateToCreate(): void {
        this.router.navigate(['/admin/books/new'])
    }
    
    deleteBook(bookId: number): void {
        if (!confirm("Are you sure you want to delete this book?")) {
            return;
        }

        this.bookService.deleteBook(bookId).subscribe({
            next: () => {
                console.log(`Book with ID ${bookId} deleted successfully.`);
                this.loadBooks();
            },
            error: (err) => {
                console.error(`Error deleting book with ID ${bookId}:`, err);
            }
        })
    }

}