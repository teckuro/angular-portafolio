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
import { AdminAuthService } from '../../features/admin/shared/services/admin-auth.service';

@Injectable()
export class AdminAuthInterceptor implements HttpInterceptor {
	constructor(private authService: AdminAuthService) {}

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
					// Limpiar datos de autenticación y redirigir al login
					this.authService.clearCurrentUser();
					// Aquí podrías redirigir al login si es necesario
				}
				return throwError(error);
			})
		);
	}
}
