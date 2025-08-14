import { Injectable } from '@angular/core';
import {
	CanActivate,
	CanActivateChild,
	Router,
	ActivatedRouteSnapshot,
	RouterStateSnapshot
} from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AdminAuthService } from '../../features/admin/services/admin-auth.service';

@Injectable({
	providedIn: 'root'
})
export class AdminAuthGuard implements CanActivate, CanActivateChild {
	constructor(
		private authService: AdminAuthService,
		private router: Router
	) {}

	canActivate(
		route: ActivatedRouteSnapshot,
		state: RouterStateSnapshot
	): Observable<boolean> {
		return this.authService.currentUser$.pipe(
			take(1),
			map((user: any) => {
				if (user && this.authService.isAuthenticated()) {
					return true;
				} else {
					this.router.navigate(['/admin/login'], {
						queryParams: { returnUrl: state.url }
					});
					return false;
				}
			})
		);
	}

	canActivateChild(
		childRoute: ActivatedRouteSnapshot,
		state: RouterStateSnapshot
	): Observable<boolean> {
		return this.canActivate(childRoute, state);
	}
}
