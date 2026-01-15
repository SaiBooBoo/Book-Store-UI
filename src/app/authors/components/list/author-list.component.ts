import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { NzTableModule } from "ng-zorro-antd/table";
import { NzButtonModule } from "ng-zorro-antd/button";
import { NzPaginationModule } from "ng-zorro-antd/pagination";
import { NzIconModule } from 'ng-zorro-antd/icon';
import { FormsModule } from "@angular/forms"; 

import { Author } from "../../models/author.model";
import { AuthorService } from "../../services/author.service";
import { Router } from "@angular/router";
import { NzSelectModule } from "ng-zorro-antd/select";
import { NzSpaceModule } from "ng-zorro-antd/space";
import { PageResponse } from "../../../shared/models/page.model";


@Component({
    selector: 'app-author-list',
    standalone: true,
    imports: [CommonModule,
       NzTableModule, 
       NzButtonModule, FormsModule,
       NzPaginationModule, NzIconModule, NzSelectModule, NzSpaceModule],

    templateUrl: './author-list.component.html',
    styleUrls: ['./author-list.component.css']
})
export class AuthorListComponent implements OnInit {

  authors: Author[] = [];

  totalElements = 0;
  pageSize = 10;
  pageIndex = 1;

  isLoading = false;

  readonly pageSizeOptions = [5, 10, 20, 50];

  constructor(private authorService: AuthorService, private router: Router) {}

  ngOnInit(): void {
    this.loadAuthors();
  }
// query criteria, 
  loadAuthors(): void {
    this.isLoading = true;

    const backendPage = this.pageIndex - 1; 

    this.authorService.getAuthors(backendPage, this.pageSize).subscribe({
      next: (response: PageResponse<Author>) => {
        this.authors = response.content;
        this.pageSize = response.page.size;
        this.totalElements = response.page.totalElements;
        this.isLoading = false;
        
      },
      error: (err) => {
        this.isLoading = false;
      }
    });
  }

  onPageChange(pageIndex: number): void {
    this.pageIndex = pageIndex;
    this.loadAuthors();
  }

  onPageSizeChange(size: number): void {
    this.pageSize = size;
    this.pageIndex = 1;
    this.loadAuthors();
  }

  navigateToCreate(): void {
    this.router.navigate(['/admin/authors/new'])
  }


  deleteAuthor(authorId: number): void{
    if(!confirm("Are you sure you want to delete this author?")){
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

}