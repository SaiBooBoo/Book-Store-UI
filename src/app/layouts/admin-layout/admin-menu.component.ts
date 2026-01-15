import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-admin-menu',
  standalone: true,
  imports: [
    RouterModule,
    NzTabsModule,
    NzIconModule
  ],
  template: `
    <nz-tabs nzType="line" nzLinkRouter>
        
      <nz-tab
        nzTitle="Books"
        nzLink="/admin/books"
        nzLinkExact>
      </nz-tab>

      
      <nz-tab
        nzTitle="Authors"
        nzLink="/admin/authors"
        nzLinkExact>
      </nz-tab>

      <nz-tab
        nzTitle="Create Book"
        nzLink="/admin/books/new">
      </nz-tab>

      <nz-tab
        nzTitle="Create Author"
        nzLink="/admin/authors/new">
      </nz-tab>

    </nz-tabs>
  `
})
export class AdminMenuComponent {}
