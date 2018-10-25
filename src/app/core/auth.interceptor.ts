import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/internal/operators';

import { AuthService } from '../services/auth.service';

@Injectable({
    providedIn: 'root'
})
export class AuthInterceptor implements HttpInterceptor {

    constructor(
        public authService: AuthService,
        private router: Router,
    ) {
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        request = this.addToken(request);
        return next.handle(request)
            // add error handling
            .pipe(
                catchError(
                    (error: any, caught: Observable<HttpEvent<any>>) => {
                        if (error.status === 401) {
                            this.handleAuthError();
                            return of(error);
                        }
                        throw error;
                    }
                ),
            );
    }

    private handleAuthError() {
        this.authService.logout();
        this.router.navigate(['/login']);
    }

    private addToken(request: HttpRequest<any>): HttpRequest<any> {
        const token: string = localStorage.getItem('token');
        if (token) {
            return request.clone({
                setHeaders: {
                    Authorization: `Bearer ${token}`,
                },
            });
        }
        return request;
    }
}
