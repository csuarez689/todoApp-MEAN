import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { catchError, tap } from 'rxjs/operators';
import { ErrorSnackBarComponent } from '../components/error-snack-bar/error-snack-bar.component';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private errorSnackBar: ErrorSnackBarComponent
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((err) => {
        if ([401, 403].includes(err.status) && this.authService.getToken())
          this.authService.logout();
        const error = (err && err.error && err.error.message) || err.statusText;

        // show error snackbar with red background
        this.errorSnackBar.openSnackBar(error, 'X', 'warn-snackbar');
        return throwError(error);
      })
    );
  }
}
