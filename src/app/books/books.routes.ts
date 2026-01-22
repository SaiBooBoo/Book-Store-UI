import { Routes } from "@angular/router";
import { BookListComponent } from "./components/list/book-list.component";
import { BookDetailComponent } from "./components/detail/book-detail.component";
import { BookCreateComponent } from "./components/create/book-create.component";
import { BookUpdateComponent } from "./components/update/book-update.component";

export const BOOK_ROUTES: Routes = [
    { path: '', component: BookListComponent, pathMatch: 'full'},
    { path: 'new', component: BookCreateComponent},
    { path: ':id/edit', component: BookUpdateComponent},
    { path: ':id', component: BookDetailComponent}
]