import { Routes } from "@angular/router";
import { BookListComponent } from "./components/list/book-list.component";
import { BookDetailComponent } from "./components/detail/book-detail.component";

export const BOOK_ROUTES: Routes = [
    { path: '', component: BookListComponent},
    { path: ':id', component: BookDetailComponent}
]