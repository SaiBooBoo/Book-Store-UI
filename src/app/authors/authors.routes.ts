import { Routes } from "@angular/router";
import { AuthorListComponent } from "./components/list/author-list.component";
import { AuthorDetailComponent } from "./components/detail/author-detail.component";
import { AuthorCreateComponent } from "./components/create/author-create.component";
import { AuthorUpdateComponent } from "./components/update/author-update.component";

export const AUTHOR_ROUTES: Routes = [
    { path: '', component: AuthorListComponent ,  pathMatch: 'full'},
    { path: 'new', component: AuthorCreateComponent},
    { path: ':id/edit', component: AuthorUpdateComponent},
    { path: ':id', component: AuthorDetailComponent},
   
]