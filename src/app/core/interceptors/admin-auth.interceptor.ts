import { Injectable } from '@angular/core';
import {
	HttpRequest,
	HttpHandler,
	HttpEvent,
	HttpInterceptor,
	HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AdminAuthService } from '../../features/admin/shared/services/admin-auth.service';

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
		// Solo interceptar requests a la API del admin
		if (request.url.includes('/admin/')) {
			const token = this.authService.getToken();
			console.log(
				'AdminAuthInterceptor: URL:',
				request.url,
				'Token:',
				token ? 'Presente' : 'Ausente'
			);

			if (token) {
				request = request.clone({
					setHeaders: {
						Authorization: `Bearer ${token}`
					}
				});
				console.log(
					'AdminAuthInterceptor: Headers agregados:',
					request.headers
				);
			} else {
				console.warn(
					'AdminAuthInterceptor: No hay token disponible para:',
					request.url
				);
			}
		}

		return next.handle(request).pipe(
			catchError((error: HttpErrorResponse) => {
				if (error.status === 401 && request.url.includes('/admin/')) {
					console.error(
						'AdminAuthInterceptor: Error 401 - Token inválido o expirado'
					);

					// Limpiar datos de autenticación
					this.authService.clearCurrentUser();

					// Redirigir al login si no estamos ya en la página de login
					const currentUrl = this.router.url;
					if (!currentUrl.includes('/admin/login')) {
						console.log(
							'AdminAuthInterceptor: Redirigiendo al login desde:',
							currentUrl
						);
						this.router.navigate(['/admin/login'], {
							queryParams: { returnUrl: currentUrl }
						});
					}
				} else if (error.status === 403 && request.url.includes('/admin/')) {
					console.error('AdminAuthInterceptor: Error 403 - Acceso denegado');
					// Redirigir al dashboard si no tenemos permisos
					this.router.navigate(['/admin/dashboard']);
				}

				return throwError(error);
			})
		);
	}
}
