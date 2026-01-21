import { bootstrapApplication } from '@angular/platform-browser';
import { importProvidersFrom } from '@angular/core';
import { RouterModule } from '@angular/router';
import { routes } from './app/app.routes';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app/app.component';
import { en_US, provideNzI18n } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { ReactiveFormsModule } from '@angular/forms';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { NzMessageService } from 'ng-zorro-antd/message';
import {  } from './app/shared/components/interceptors/http-error.interceptor';

registerLocaleData(en);

bootstrapApplication(AppComponent, {
  providers: [
    
    provideHttpClient(
      withInterceptors([])),
    NzMessageService,
    importProvidersFrom(RouterModule.forRoot(routes)),
    provideNzI18n(en_US),
    importProvidersFrom(HttpClientModule, ReactiveFormsModule)
  ]
})
  .catch((err) => console.error(err));
