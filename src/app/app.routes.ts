import { RouterModule, Routes } from '@angular/router';
import { BookListComponent } from './books/components/list/book-list.component';
import { AuthorListComponent } from './authors/components/list/author-list.component';
import { AuthorCreateComponent } from './authors/components/create/author-create.component';
import { BookCreateComponent } from './books/components/create/book-create.component';
import { AuthGuard } from './core/guards/auth.guard';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { NgModule } from '@angular/core';

export const routes: Routes = [

   {path: '', redirectTo: 'admin', pathMatch: 'full'},
    {
        path: 'admin', 
        component: AdminLayoutComponent,
        // canActivate[AuthGuard],
        children: [
            {
                path: '',
                redirectTo: 'books',
                pathMatch: 'full'
            },
            {
                path: 'books',
                loadChildren: () => 
                    import('./books/books.routes')
                        .then(m => m.BOOK_ROUTES)
            },
            {
                path: 'authors',
                loadChildren: () =>
                    import('./authors/authors.routes')
                        .then(m => m.AUTHOR_ROUTES)
            },
        ]}
];



