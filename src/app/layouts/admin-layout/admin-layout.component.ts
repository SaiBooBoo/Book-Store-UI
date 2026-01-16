import { Component } from "@angular/core";
import { NzPageHeaderModule } from "ng-zorro-antd/page-header";
import { NzTabsModule } from 'ng-zorro-antd/tabs'; 
import { RouterModule, RouterOutlet } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzLayoutModule } from 'ng-zorro-antd/layout';

@Component({
    standalone: true,
    selector: 'app-admin-layout',
    templateUrl: './admin-layout.component.html',
    styleUrls: ['./admin-layout.component.css'],
    imports: [
        NzPageHeaderModule,
        NzTabsModule,
        RouterModule,
        RouterOutlet,
        NzIconModule,
        NzMenuModule,
        NzLayoutModule
    ]
})
export class AdminLayoutComponent {
    collapsed = false;
}