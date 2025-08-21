import { Injectable } from '@angular/core';
import {
	CanActivate,
	Router,
	ActivatedRouteSnapshot,
	RouterStateSnapshot
} from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AdminAuthService } from '../../features/admin/shared/services/admin-auth.service';

@Injectable({
	providedIn: 'root'
})
export class AdminRoleGuard implements CanActivate {
	constructor(
		private authService: AdminAuthService,
		private router: Router
	) {}

	canActivate(
		route: ActivatedRouteSnapshot,
		state: RouterStateSnapshot
	): Observable<boolean> {
		const requiredRole = route.data['role'] as 'admin' | 'super_admin';

		return this.authService.currentUser$.pipe(
			take(1),
			map((user: any) => {
				if (user && this.authService.hasRole(requiredRole)) {
					return true;
				} else {
					this.router.navigate(['/admin/dashboard'], {
						queryParams: { error: 'insufficient_permissions' }
					});
					return false;
				}
			})
		);
	}
}
