import { Injectable } from '@angular/core';
import {
	CanActivate,
	ActivatedRouteSnapshot,
	RouterStateSnapshot,
	Router
} from '@angular/router';
import { Observable } from 'rxjs';
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
		console.log('AdminAuthGuard: ¿Está autenticado?', this.authService.isAuthenticated());
		console.log('AdminAuthGuard: Usuario actual:', this.authService.getCurrentUser());
		console.log('AdminAuthGuard: Token presente:', !!this.authService.getToken());

		if (this.authService.isAuthenticated()) {
			console.log('AdminAuthGuard: Acceso permitido');
			return true;
		}

		// No autenticado, redirigir al login
		console.log('AdminAuthGuard: Acceso denegado, redirigiendo al login');
		this.router.navigate(['/admin/login'], {
			queryParams: { returnUrl: state.url }
		});
		return false;
	}
}
