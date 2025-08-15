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
		if (this.authService.isAuthenticated()) {
			return true;
		}

		// No autenticado, redirigir al login
		this.router.navigate(['/admin/login'], {
			queryParams: { returnUrl: state.url }
		});
		return false;
	}
}
