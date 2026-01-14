import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { NzTableModule } from "ng-zorro-antd/table";
import { NzButtonModule } from "ng-zorro-antd/button";
import { NzPaginationModule } from "ng-zorro-antd/pagination";
import { NzIconModule } from 'ng-zorro-antd/icon';

import { Author } from "../../models/author.model";
import { AuthorService } from "../../services/author.service";


@Component({
    selector: 'app-author-list',
    standalone: true,
    imports: [CommonModule, NzTableModule, NzButtonModule, NzPaginationModule, NzIconModule],
    templateUrl: './author-list.component.html',
    styleUrls: ['./author-list.component.css']
})
export class AuthorListComponent implements OnInit {

  authors: Author[] = [];

  totalElements = 0;
  pageSize = 10;
  pageIndex = 1;

  isLoading = false;

  constructor(private authorService: AuthorService) {}

  ngOnInit(): void {
    this.loadAuthors();
  }

  loadAuthors(): void {
    this.isLoading = true;

    const backendPage = this.pageIndex - 1; 

    this.authorService.getAuthors(backendPage).subscribe({
      next: (data) => {
        this.authors = data.content;
        this.pageSize = data.page.size;
        this.totalElements = data.page.totalElements;
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