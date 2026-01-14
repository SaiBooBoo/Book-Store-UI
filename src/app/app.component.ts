import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { Router, RouterModule } from "@angular/router";
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { AuthorCreateComponent } from "./authors/features/author-create/author-create.component";

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    imports: [CommonModule, RouterModule, NzPageHeaderModule, NzButtonModule, NzMenuModule, 
    ],
})
export class AppComponent {

    constructor(private router: Router) {}
    //modifiers
    // modules
    // constant call

    goToCreateAuthor() {
        this.router.navigate(['/admin/author/new']);
    }

    goToCreateBook() {
        this.router.navigate(['/admin/book/new'])
    }
 }