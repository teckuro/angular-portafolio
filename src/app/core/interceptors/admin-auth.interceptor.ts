import { Injectable } from '@angular/core';
import {
	HttpRequest,
	HttpHandler,
	HttpEvent,
	HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
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
			if (token) {
				request = request.clone({
					setHeaders: {
						Authorization: `Bearer ${token}`
					}
				});
			}
		}

		return next.handle(request);
	}
}
