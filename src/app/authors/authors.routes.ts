import { Routes } from "@angular/router";
import { AuthorListComponent } from "./components/list/author-list.component";
import { AuthorDetailComponent } from "./components/detail/author-detail.component";
import { AuthorCreateComponent } from "./components/create/author-create.component";

export const AUTHOR_ROUTES: Routes = [
    { path: '', component: AuthorListComponent },
    { path: 'new', component: AuthorCreateComponent},
    { path: ':id', component: AuthorDetailComponent},
   
]