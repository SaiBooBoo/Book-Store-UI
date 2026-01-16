import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { NzTableModule } from "ng-zorro-antd/table";
import { NzButtonModule } from "ng-zorro-antd/button";
import { NzPaginationModule } from "ng-zorro-antd/pagination";
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { FormsModule } from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { ChangeDetectorRef } from "@angular/core";

import { Author, AuthorFilter } from "../../models/author.model";
import { AuthorService } from "../../services/author.service";
import { Router } from "@angular/router";
import { NzSelectModule } from "ng-zorro-antd/select";
import { NzSpaceModule } from "ng-zorro-antd/space";
import { DataTableInput } from "../../../shared/models/datatable";


@Component({
  selector: 'app-author-list',
  standalone: true,
  imports: [CommonModule,
    NzTableModule,
    NzButtonModule, FormsModule, NzDividerModule, NzInputModule,
    NzPaginationModule, NzIconModule, NzSelectModule, NzSpaceModule],

  templateUrl: './author-list.component.html',
  styleUrls: ['./author-list.component.css']
})
export class AuthorListComponent implements OnInit {

  authors: Author[] = [];
  totalRecords = 0;
  loading = false;
  pageSizeOptions: number[] = [5, 10, 20, 50];
  tableInput: DataTableInput = {
    pageIndex: 1,
    pageSize: 10,
    sortField: null,
    sortOrder: null,
    searchValue: null
  }

  constructor(private authorService: AuthorService, private router: Router
    , private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadAuthors();
  }

  loadAuthors(): void {
    this.loading = true;

    this.authorService.getAuthorsTable(this.tableInput)
      .subscribe({
        next: res => {
          console.log('datatable response', res);
          this.authors = res.data || [];
          this.totalRecords = res.recordsFiltered || res.recordsTotal || 0;
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: () => {
          this.loading = false;
          this.cdr.detectChanges();
        }
      })
  }

  onPageChange(pageIndex: number): void {
    this.tableInput.pageIndex = pageIndex;
    this.loadAuthors();
  }

  onPageSizeChange(size: number): void {
    this.tableInput.pageSize = size;
    this.tableInput.pageIndex = 1;
    this.loadAuthors();
  }

  onSearchChange(): void {
    this.tableInput.pageIndex = 1;
    this.loadAuthors();
  }

  onSort(field: string, order: string | null): void {
    this.tableInput.sortField = field;
    this.tableInput.sortOrder = order;
    this.tableInput.pageIndex = 1;
    this.loadAuthors();
  }

  onSearch(value: string): void {
    this.tableInput.searchValue = value;
    this.tableInput.pageIndex = 1;
    this.loadAuthors();
  }

  navigateToCreate(): void {
    this.router.navigate(['/admin/authors/new'])
  }


  deleteAuthor(authorId: number): void {
    if (!confirm("Are you sure you want to delete this author?")) {
      return;
    }

    this.authorService.deleteAuthor(authorId).subscribe({
      next: () => {
        console.log(`Author with ID ${authorId} deleted successfully.`);
        this.loadAuthors();
      },
      error: (err) => {
        console.error(`Error deleting author with ID ${authorId}:`, err);
      }
    })
  }

  getTotalPages(total: number): number {
    return Math.ceil(total / this.tableInput.pageSize);
  }

}
