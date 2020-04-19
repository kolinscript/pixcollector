import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpHeaders,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';

@Injectable()
export class InterceptorService implements HttpInterceptor {

  constructor(
    private router: Router
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const url = req.url;
    const request = req.clone({ url: url, headers: this.withAuthorization(req.headers) });
    return next.handle(request).pipe(
      catchError((err: HttpErrorResponse) => {
        if (err.status === 401) {
          localStorage.clear();
          this.router.navigate(['/auth']);
        }
        return throwError(err);
        }
      )
    );
  }

  private withAuthorization(headers: HttpHeaders): HttpHeaders {
    const token = this.getToken();
    if (token) {
      return headers.set('x-csrf-token', token);
    }
    return headers;
  }

  private getToken(): string {
    return localStorage.getItem('token');
  }
}
