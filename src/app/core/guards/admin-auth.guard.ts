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
		// Verificar autenticación local primero
		if (this.authService.isAuthenticated()) {
			return true;
		}

		// Si no está autenticado localmente, verificar con el servidor
		return this.authService.validateToken().pipe(
			map((isValid) => {
				if (isValid) {
					return true;
				} else {
					this.redirectToLogin(state.url);
					return false;
				}
			}),
			catchError((error) => {
				this.redirectToLogin(state.url);
				return of(false);
			})
		);
	}

	/**
	 * Redirigir al login con la URL de retorno
	 */
	private redirectToLogin(returnUrl: string): void {
		this.router.navigate(['/admin/login'], {
			queryParams: { returnUrl: returnUrl }
		});
	}
}
