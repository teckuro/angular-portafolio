import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AdminAuthService } from '../../services/admin-auth.service';
import { AdminUser } from '../../models/admin-user.model';

@Component({
	selector: 'app-admin-layout',
	templateUrl: './admin-layout.component.html',
	styleUrls: ['./admin-layout.component.css']
})
export class AdminLayoutComponent implements OnInit {
	currentUser: AdminUser | null = null;
	sidebarCollapsed = false;
	currentRoute = '';

	constructor(
		private authService: AdminAuthService,
		private router: Router
	) {}

	ngOnInit(): void {
		this.currentUser = this.authService.getCurrentUser();

		// Track current route for breadcrumbs
		this.router.events
			.pipe(filter((event) => event instanceof NavigationEnd))
			.subscribe((event: any) => {
				this.currentRoute = event.url;
			});
	}

	toggleSidebar(): void {
		this.sidebarCollapsed = !this.sidebarCollapsed;
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

	getPageTitle(): string {
		const routeMap: { [key: string]: string } = {
			'/admin/dashboard': 'Dashboard',
			'/admin/works': 'Experiencia Laboral',
			'/admin/works/list': 'Lista de Experiencias',
			'/admin/works/new': 'Nueva Experiencia',
			'/admin/works/edit': 'Editar Experiencia',
			'/admin/projects': 'Proyectos',
			'/admin/projects/list': 'Lista de Proyectos',
			'/admin/projects/new': 'Nuevo Proyecto',
			'/admin/projects/edit': 'Editar Proyecto'
		};

		return routeMap[this.currentRoute] || 'Panel de Administración';
	}
}
