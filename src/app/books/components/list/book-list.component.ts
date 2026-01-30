import { Component, inject, OnInit } from "@angular/core";
import { CommonModule } from '@angular/common';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { ActivatedRoute, Router } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { ChangeDetectorRef } from "@angular/core";

import { Book } from "../../model/book.model";
import { NzIconDirective } from "ng-zorro-antd/icon";
import { BookService } from "../../service/book.service";
import { NzSelectModule } from "ng-zorro-antd/select";
import { BookQueryCriteria, DataTableInput, DataTableOutput } from "../../../shared/models/datatable";
import { map, Observable, Subscription } from "rxjs";
import { NzMessageService } from "ng-zorro-antd/message";
import { NzModalModule, NzModalService } from "ng-zorro-antd/modal";
import { NzInputModule } from "ng-zorro-antd/input";
import { AuthService } from "../../../core/services/auth.service";




@Component({
    selector: 'app-book-list',
    standalone: true,
    imports: [CommonModule,
        NzTableModule,
        NzButtonModule,
        NzPaginationModule,
        NzIconDirective,
        NzIconModule,
        NzDividerModule,
        NzSelectModule,
        FormsModule,
        NzInputModule,
        NzModalModule],
    templateUrl: './book-list.component.html',
    styleUrls: ['./book.list.component.css']
})
export class BookListComponent implements OnInit {

    data: Book[] = [];
    total = 0;
    loading = false;

    tableInput: DataTableInput<BookQueryCriteria> = {
        pageIndex: 1,
        pageSize: 10,
        sortField: 'id',
        sortOrder: 'ascend',
        queryCriteria: {},
        searchValue: '',
        draw: 1
    };

   
    private subscriptions = new Subscription();

    constructor(
        private bookService: BookService,
        private modal: NzModalService,
        private message: NzMessageService,
        private router: Router,
        private cdr: ChangeDetectorRef,
        private route: ActivatedRoute
    ) { }

     private authService = inject(AuthService);
     isAuthenticated$!: Observable<boolean>;

    ngOnInit(): void {
        this.loadBooks();
        this.isAuthenticated$ = this.authService.isAuthenticated$;
    }
     role$ = this.authService.role$;
     isAdmin$ = this.role$.pipe(map(role => role === 'ROLE_ADMIN'));


    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    loadBooks(resetDraw = false): void {
        this.loading = true;
         this.tableInput.draw = resetDraw ? 1 : (this.tableInput.draw ?? 0) + 1;

        const request: DataTableInput<BookQueryCriteria> = {
            ...this.tableInput,
            queryCriteria: {
                ...this.tableInput.queryCriteria,
                blurry: this.tableInput.searchValue?.trim() || undefined
            }
        };

        const sub = this.bookService.datatableBook(request).subscribe({
            next: (res: DataTableOutput<Book>) => {
                this.data = res?.data || [];
                this.total = Number(res?.recordsFiltered ?? res?.recordsTotal ?? 0);
                this.loading = false;
                this.cdr.detectChanges();
            },
            error: (err) => {
                console.error('Failed to load books', err);
                this.loading = false;
                this.cdr.detectChanges();
            }
        });

        this.subscriptions.add(sub);
    }

    onPageChange(pageIndex: number): void {
        this.tableInput.pageIndex = pageIndex;
        this.loadBooks();
    }

    onPageSizeChange(size: number): void {
        this.tableInput.pageSize = size;
        this.tableInput.pageIndex = 1;
        this.loadBooks();
    }

   onSearchChange(): void {
        this.tableInput.pageIndex = 1;
        this.loadBooks(true);
    }

    navigateToCreate(): void {
        this.router.navigate(['/admin/books/new'])
    }

    navigateToUpdate(bookId: number): void {
        if (!bookId) return;
        this.router.navigate([`/admin/books/${bookId}/edit`])
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

    onSort(field: string, order: string | null): void {
        this.tableInput.sortField = field;
        this.tableInput.sortOrder = (order as 'ascend' | 'descend') ?? undefined;
        this.tableInput.pageIndex = 1;
        this.loadBooks(true);
    }

    getTotalPages(): number {
        return Math.max(1, Math.ceil(this.total / this.tableInput.pageSize));
    }
}