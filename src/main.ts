import { bootstrapApplication } from '@angular/platform-browser';
import { importProvidersFrom } from '@angular/core';
import { RouterModule } from '@angular/router';
import { routes } from './app/app.routes';
import { HTTP_INTERCEPTORS, HttpClientModule, withInterceptorsFromDi } from '@angular/common/http';
import { AppComponent } from './app/app.component';
import { en_US, provideNzI18n } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { ReactiveFormsModule } from '@angular/forms';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { NzMessageService } from 'ng-zorro-antd/message';
import {  } from './app/shared/components/interceptors/http-error.interceptor';
import { AuthInterceptor } from './app/core/interceptors/auth.interceptors';

registerLocaleData(en);

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(withInterceptorsFromDi()), // Enable DI-based interceptors
    { // not sure if this will work or not
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }, NzMessageService ,
    importProvidersFrom(RouterModule.forRoot(routes)),
    provideNzI18n(en_US),
    importProvidersFrom(HttpClientModule, ReactiveFormsModule)
  ]
})
  .catch((err) => console.error(err));
