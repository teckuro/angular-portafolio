import { Injectable } from '@angular/core';
import {
	HttpRequest,
	HttpHandler,
	HttpEvent,
	HttpInterceptor,
	HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorHandlerInterceptor implements HttpInterceptor {
	intercept(
		request: HttpRequest<any>,
		next: HttpHandler
	): Observable<HttpEvent<any>> {
		return next.handle(request).pipe(
			catchError((error: HttpErrorResponse) => {
				console.error('HTTP Error:', {
					url: request.url,
					status: error.status,
					statusText: error.statusText,
					message: error.message,
					error: error.error
				});

				// Manejar errores específicos
				if (error.status === 0) {
					console.error('Error de conexión - verificar CORS y conectividad');
				}

				return throwError(error);
			})
		);
	}
}
