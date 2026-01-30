
import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { AuthGuard } from './core/Bog/auth.guard';

export const routes: Routes = [

   {path: '', redirectTo: 'auth/login', pathMatch: 'full'},
    {
        path: 'admin', 
        component: AdminLayoutComponent,
        canLoad: [AuthGuard],
        canActivateChild: [AuthGuard],
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
        ]},
        {
                path: 'auth',
                loadChildren: () =>
                    import('./core/services/auth.routes')
                        .then(m => m.AUTH_ROUTES )
        },
        {
            path: '**', redirectTo: '/auth/login'
        }
];



