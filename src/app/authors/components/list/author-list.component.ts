import { Component, OnInit, OnDestroy, ChangeDetectorRef, Inject, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { NzTableModule } from 'ng-zorro-antd/table';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzModalModule } from'ng-zorro-antd/modal';


import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, timer } from 'rxjs';

import { AuthorService } from '../../services/author.service';
import { Author } from '../../models/author.model';
import { AuthorQueryCriteria, DataTableInput, DataTableOutput } from '../../../shared/models/datatable';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-author-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NzTableModule,
    NzPaginationModule,
    NzInputModule,
    NzButtonModule,
    NzIconModule,
    NzDividerModule,
    NzSelectModule,
    NzSpaceModule,
    NzModalModule,
  ],
  template: `
  <div class="d-flex container justify-content-between align-items-center mb-3">
    <div class="toolbar">
      <div class="toolbar-left">
        <h2 class="toolbar-title">Authors</h2>

        <nz-input-group class="search-input" [nzPrefix]="prefixIconSearch" nzSearch>
          <input
            nz-input
            type="text"
            placeholder="Search authors..."
            [(ngModel)]="tableInput.searchValue"
            (ngModelChange)="onSearchChange()"
          />
        </nz-input-group>
      </div>

      <button nz-button nzType="primary" nzSize="large" (click)="navigateToCreate()">
        <nz-icon nzType="plus"></nz-icon>
        Create Author
      </button>
    </div>
  </div>

  <ng-template #prefixIconSearch><nz-icon nzType="search"></nz-icon></ng-template>

  <nz-table
    [nzLoading]="loading"
    [nzData]="data"
    [nzFrontPagination]="false"
    [nzBordered]="true"
    nzSize="middle"
  >
    <thead>
      <tr>
        <th>ID</th>
        <th nzColumnKey="firstName" nzShowSort (nzSortOrderChange)="onSort('firstName', $event)">First Name</th>
        <th nzColumnKey="lastName" nzShowSort (nzSortOrderChange)="onSort('lastName', $event)">Last Name</th>
        <th nzColumnKey="email" nzShowSort (nzSortOrderChange)="onSort('email', $event)">Email</th>
        <th>Bio</th>
        <th nzWidth="180px">Actions</th>
      </tr>
    </thead>

    <tbody>
      <tr *ngFor="let author of data">
        <td>{{ author.id }}</td>
        <td>{{ author.firstName }}</td>
        <td>{{ author.lastName }}</td>
        <td>{{ author.email }}</td>
        <td class="truncate-text">{{ author.bio }}</td>
        <td>
          <button 
    nz-button 
    nzType="link" 
    (click)="editAuthor(author.id)"
    aria-label="Edit author">
    <mat-icon nz-icon nzType="edit"></mat-icon>
  </button>

          <nz-divider nzType="vertical"></nz-divider>
          <a (click)="deleteAuthor(author.id)" nzDanger>
            <nz-icon nzType="delete" nzTheme="outline"></nz-icon> Delete
          </a>
        </td>
      </tr>
    </tbody>
  </nz-table>

  <div class="center-container-grid mt-3">
    <div class="content-to-center">
      <nz-pagination
        [nzPageIndex]="tableInput.pageIndex"
        [nzPageSize]="tableInput.pageSize"
        [nzTotal]="total"
        [nzShowSizeChanger]="true"
        [nzPageSizeOptions]="[5,10,20,50]"
        [nzShowTotal]="totalTpl"
        (nzPageIndexChange)="onPageChange($event)"
        (nzPageSizeChange)="onPageSizeChange($event)"
      >
      </nz-pagination>
    </div>

    <ng-template #totalTpl let-total let-range="range">
      Showing {{ range[0] }}–{{ range[1] }} of {{ total }} items ·
      Page {{ tableInput.pageIndex }} of {{ getTotalPages() }}
    </ng-template>
  </div>
  `,
  styles: [`
    .toolbar { display:flex; gap:1rem; align-items:center; justify-content:space-between; width:100%; }
    .toolbar-left { display:flex; gap:1rem; align-items:center; }
    .toolbar-title { margin:0; }
    .search-input { width: 360px; }
    .truncate-text { max-width: 240px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .center-container-grid { margin-top: 1rem; display:flex; justify-content:center; align-items:center; }
  `]
})
export class AuthorListComponent implements OnInit, OnDestroy {
  data: Author[] = [];
  total = 0;
  loading = false;

  tableInput: DataTableInput<AuthorQueryCriteria> = {
    pageIndex: 1,  
    pageSize: 10,
    sortField: 'id',
    sortOrder: 'ascend',
    queryCriteria: {},
    searchValue: '',
    draw: 1     
  };

  criteria: AuthorQueryCriteria = {};
  private subscriptions = new Subscription();

  constructor(
    private authorService: AuthorService,
    private modal : NzModalService,
    private message : NzMessageService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute
  ) { }

  private authService = inject(AuthService);

  ngOnInit(): void {
    this.loadData();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private buildCriteria(): AuthorQueryCriteria {
    const criteria: AuthorQueryCriteria = { ...this.criteria };
    if (this.tableInput.searchValue?.trim()) {
      criteria.blurry = this.tableInput.searchValue.trim();
    } else {
      delete (criteria as any).blurry; // check the filter for the backend -> empty, missing, null
    }
    return criteria;
  }

  private buildRequest(): DataTableInput<AuthorQueryCriteria> {
    return {
      ...this.tableInput,
      queryCriteria: this.buildCriteria(),
      draw: this.tableInput.draw
    };
  }

  loadData(resetDraw = false): void {
    if (resetDraw) {
      this.tableInput.draw = 1;
       this.cdr.detectChanges();
    } else {
      this.tableInput.draw = (this.tableInput.draw ?? 0) + 1;
       this.cdr.detectChanges();
    }

    const request = this.buildRequest();
    this.loading = true;

    const sub = this.authorService.datatable(request).subscribe({
      next: (res: DataTableOutput<Author>) => {
        this.data = res?.data || [];
        this.total = Number(res?.recordsFiltered ?? res?.recordsTotal ?? 0);
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err: HttpErrorResponse) => {
        console.error('Failed to load authors', err);
        
        this.loading = false;
        this.cdr.detectChanges();
      }
    });

    this.subscriptions.add(sub);
  }

  onSearchChange(): void {
    this.tableInput.pageIndex = 1;
    this.loadData(true); // reset draw on new search
  }

  onPageChange(page: number): void {
    this.tableInput.pageIndex = page;
    this.loadData();      // draw auto-increments
  }

  onPageSizeChange(size: number): void {
    this.tableInput.pageSize = size;
    this.tableInput.pageIndex = 1;
    this.loadData(true); // reset draw when changing page size
  }

  onSort(field: string, order: string | null): void {
    this.tableInput.sortField = field;
    this.tableInput.sortOrder = (order as 'ascend' | 'descend') ?? undefined;
    this.tableInput.pageIndex = 1;
    this.loadData(true); // reset draw on sort
  }

  editAuthor(authorId: number): void {
    if (!authorId) return;
    this.router.navigate(['/admin/authors', authorId, 'edit'])
  }

  navigateToCreate(): void {
    this.router.navigate(['new'], { relativeTo: this.route });
  }
 deleteAuthor(authorId: number): void {
   if (!confirm("Are you sure you want to delete this author?")) {
            return;
        }

  this.authorService.deleteAuthor(authorId).subscribe({
    next: () => {
      this.message.success('Author deleted successfully');

      // reload first page safely
      this.tableInput.pageIndex = 1;
      this.loadData(true);
    },
    error: () => {
      this.message.error('Failed to delete author');
    }
  });
}

  confirmDelete(authorId: number): void {
    this.modal.confirm({
      nzTitle: 'Are you sure you want to delete this author?',
      nzContent: 'This action cannot be undone.',
      nzOkText: 'Delete',
      nzOkDanger: true,
      nzOnOk: () => this.deleteAuthor(authorId)
    }); 
  }

  getTotalPages(): number {
    return Math.ceil(this.total / this.tableInput.pageSize) || 1;
  }
}