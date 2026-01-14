import { Routes } from '@angular/router';
import { BookListComponent } from './books/features/book-list/book-list.component';
import { AuthorListComponent } from './authors/features/author-list/author-list.component';
import { AuthorCreateComponent } from './authors/features/author-create/author-create.component';
import { BookCreateComponent } from './books/features/book-create/book-create.component';

export const routes: Routes = [
    { path: '', redirectTo: 'admin/books', pathMatch: 'full'},
    { path: 'admin/books', component: BookListComponent},
    { path: 'admin/authors', component: AuthorListComponent},
    { path: 'admin/author/new', component: AuthorCreateComponent},
    { path: 'admin/book/new', component: BookCreateComponent}
];
