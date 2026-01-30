
import { Component } from "@angular/core";
import { Router, RouterModule, RouterOutlet } from "@angular/router";
import { AuthService } from "./core/services/auth.service";
import { UndoService } from "./core/services/auth.undoService";


@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet],
    template: '<router-outlet></router-outlet>',
})
export class AppComponent {

    constructor(private router: Router,) {}

}