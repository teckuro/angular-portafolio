import { Component, OnInit } from '@angular/core';
import { AdminAuthService } from '../services/admin-auth.service';
import { AdminProjectsService } from '../services/admin-projects.service';
import { AdminWorksService } from '../services/admin-works.service';
import { AdminUser } from '../models/admin-user.model';

@Component({
	selector: 'app-admin-dashboard',
	templateUrl: './admin-dashboard.component.html',
	styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
	currentUser: AdminUser | null = null;
	projectStats: any = null;
	workStats: any = null;
	loading = true;

	constructor(
		private authService: AdminAuthService,
		private projectsService: AdminProjectsService,
		private worksService: AdminWorksService
	) {}

	ngOnInit(): void {
		this.currentUser = this.authService.getCurrentUser();
		this.loadStats();
	}

	loadStats(): void {
		this.loading = true;

		// Cargar estadísticas de proyectos
		this.projectsService.getProjectStats().subscribe({
			next: (stats) => {
				this.projectStats = stats;
			},
			error: (error) => {
				console.error('Error loading project stats:', error);
			}
		});

		// Cargar estadísticas de trabajos
		this.worksService.getWorkStats().subscribe({
			next: (stats) => {
				this.workStats = stats;
			},
			error: (error) => {
				console.error('Error loading work stats:', error);
			},
			complete: () => {
				this.loading = false;
			}
		});
	}

	logout(): void {
		this.authService.logout().subscribe(() => {
			// El interceptor se encargará de la redirección
		});
	}

	getUserRoleLabel(): string {
		if (!this.currentUser) return '';
		return this.currentUser.role === 'super_admin'
			? 'Super Administrador'
			: 'Administrador';
	}
}
