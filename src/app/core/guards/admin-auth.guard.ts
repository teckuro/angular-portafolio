import { Injectable } from '@angular/core';
import {
	CanActivate,
	ActivatedRouteSnapshot,
	RouterStateSnapshot,
	Router
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { AdminAuthService } from '../../features/admin/shared/services/admin-auth.service';

@Injectable({
	providedIn: 'root'
})
export class AdminAuthGuard implements CanActivate {
	constructor(
		private authService: AdminAuthService,
		private router: Router
	) {}

	canActivate(
		route: ActivatedRouteSnapshot,
		state: RouterStateSnapshot
	): Observable<boolean> | Promise<boolean> | boolean {
		console.log('AdminAuthGuard: Verificando acceso a:', state.url);
		
		// Verificar autenticación local primero
		if (this.authService.isAuthenticated()) {
			console.log('AdminAuthGuard: Usuario autenticado localmente, permitiendo acceso');
			return true;
		}

		// Si no está autenticado localmente, verificar con el servidor
		console.log('AdminAuthGuard: Verificando token con el servidor');
		return this.authService.validateToken().pipe(
			tap((isValid) => {
				console.log('AdminAuthGuard: Validación del servidor:', isValid);
			}),
			map((isValid) => {
				if (isValid) {
					console.log('AdminAuthGuard: Token válido, permitiendo acceso');
					return true;
				} else {
					console.log('AdminAuthGuard: Token inválido, redirigiendo al login');
					this.redirectToLogin(state.url);
					return false;
				}
			}),
			catchError((error) => {
				console.error('AdminAuthGuard: Error validando token:', error);
				this.redirectToLogin(state.url);
				return of(false);
			})
		);
	}

	/**
	 * Redirigir al login con la URL de retorno
	 */
	private redirectToLogin(returnUrl: string): void {
		console.log('AdminAuthGuard: Redirigiendo al login con returnUrl:', returnUrl);
		this.router.navigate(['/admin/login'], {
			queryParams: { returnUrl: returnUrl }
		});
	}
}
