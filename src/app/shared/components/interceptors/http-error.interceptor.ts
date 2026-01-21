// import { HttpInterceptorFn } from "@angular/common/http";
// import { inject } from "@angular/core";
// import { NzMessageService } from "ng-zorro-antd/message";
// import { throwError } from "rxjs";
// import { catchError } from "rxjs/operators";


// export const httpErrorIncerceptor: HttpInterceptorFn = (req, next) => {
//     const message = inject(NzMessageService);

//     return next(req).pipe(
//         catchError(err => {

//             if (err.status >= 500) {
//                 message.error('A server error, please try again later.');
//             }

//             if (![400, 409].includes(err.status) && err.status < 500) {
//                 message.error(err.error?.message || 'Unexpected error occurred');
//             }

//             return throwError(() => err);
//         })
//     )
// }
import { HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { NzMessageService } from "ng-zorro-antd/message";
import { throwError } from "rxjs";
import { catchError } from "rxjs/operators";

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const message = inject(NzMessageService);

  return next(req).pipe(
    catchError((err) => {
      // 1. Critical Server Errors
      if (err.status >= 500) {
        message.error('Server unreachable. Please try again later.');
      } 
      // 2. Client Errors NOT handled by forms (Exclude 400 and 409)
      else if (![400, 409].includes(err.status)) {
        const errorMsg = err.error?.message || 'An unexpected error occurred';
        message.error(errorMsg);
      }

      // Always re-throw so the component knows the call failed
      return throwError(() => err);
    })
  );
};