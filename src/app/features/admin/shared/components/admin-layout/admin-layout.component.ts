import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AdminAuthService } from '../../services/admin-auth.service';
import { AdminUser } from '../../models/admin-user.model';

@Component({
	selector: 'app-admin-layout',
	templateUrl: './admin-layout.component.html',
	styleUrls: ['./admin-layout.component.css']
})
export class AdminLayoutComponent implements OnInit, OnDestroy {
	currentUser: AdminUser | null = null;
	sidebarCollapsed = false;
	mobileMenuOpen = false;
	pageTitle = 'Panel de Administración';
	private userSubscription: Subscription | null = null;

	constructor(
		private authService: AdminAuthService,
		private router: Router
	) {}

	ngOnInit(): void {
		// Suscribirse a los cambios del usuario actual
		this.userSubscription = this.authService.currentUser$.subscribe((user) => {
			console.log('Usuario actualizado en layout:', user);
			this.currentUser = user;
		});
	}

	@HostListener('window:resize', ['$event'])
	onResize(event: any): void {
		// Si cambia de móvil a desktop, cerrar el menú móvil
		if (event.target.innerWidth > 1024 && this.mobileMenuOpen) {
			this.mobileMenuOpen = false;
		}
		// Si cambia de desktop a móvil, expandir el sidebar
		if (event.target.innerWidth <= 1024 && this.sidebarCollapsed) {
			this.sidebarCollapsed = false;
		}
	}

	ngOnDestroy(): void {
		if (this.userSubscription) {
			this.userSubscription.unsubscribe();
		}
	}

	toggleSidebar(): void {
		// En móvil, alternar el menú móvil
		if (window.innerWidth <= 1024) {
			this.mobileMenuOpen = !this.mobileMenuOpen;
			// En móvil, cuando se abre el menú, asegurar que no esté colapsado
			if (this.mobileMenuOpen) {
				this.sidebarCollapsed = false;
			}
		} else {
			// En desktop, alternar el colapso
			this.sidebarCollapsed = !this.sidebarCollapsed;
		}
	}

	closeMobileMenu(): void {
		this.mobileMenuOpen = false;
	}

	onNavClick(event: MouseEvent): void {
		// Solo prevenir clicks del botón medio (auxclick) para evitar apertura en nueva pestaña
		if (event.button === 1) {
			event.preventDefault();
			event.stopPropagation();
			return;
		}
	}

	logout(): void {
		this.authService.logout().subscribe(() => {
			this.router.navigate(['/admin/login']);
		});
	}

	getUserRoleLabel(): string {
		if (!this.currentUser) return '';
		return this.currentUser.role === 'super_admin'
			? 'Super Administrador'
			: 'Administrador';
	}
}
