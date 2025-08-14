import { Injectable } from '@angular/core';
import {
	HttpInterceptor,
	HttpRequest,
	HttpHandler,
	HttpEvent,
	HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AdminAuthService } from '../../features/admin/services/admin-auth.service';

@Injectable()
export class AdminAuthInterceptor implements HttpInterceptor {
	constructor(
		private authService: AdminAuthService,
		private router: Router
	) {}

	intercept(
		request: HttpRequest<any>,
		next: HttpHandler
	): Observable<HttpEvent<any>> {
		// Solo interceptar requests a la API de admin
		if (request.url.includes('/admin/')) {
			const token = this.authService.getToken();

			if (token) {
				request = request.clone({
					setHeaders: {
						Authorization: `Bearer ${token}`,
						'Content-Type': 'application/json',
						Accept: 'application/json'
					}
				});
			}
		}

		return next.handle(request).pipe(
			catchError((error: HttpErrorResponse) => {
				if (error.status === 401) {
					// Token expirado o inválido
					this.authService.logout().subscribe(() => {
						this.router.navigate(['/admin/login']);
					});
				}
				return throwError(() => error);
			})
		);
	}
}
