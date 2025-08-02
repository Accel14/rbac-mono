import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpInterceptorFn } from '@angular/common/http';
import { Observable } from 'rxjs';


export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const jwt = localStorage.getItem('access_token');
  console.log('JwtInterceptor intercept:', jwt);
  if (jwt) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${jwt}`
      }
    });
  }
  return next(req);
};

// @Injectable()
// export class JwtInterceptor implements HttpInterceptor {
//   intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
//     const jwt = localStorage.getItem('access_token');
//     console.log('JwtInterceptor intercept:', jwt);
//     if (jwt) {
//       request = request.clone({
//         setHeaders: {
//           Authorization: `Bearer ${jwt}`
//         }
//       });
//     }
//     return next.handle(request);
//   }
// }