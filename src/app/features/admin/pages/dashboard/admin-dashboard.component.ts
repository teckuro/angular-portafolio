import { Component, OnInit } from '@angular/core';
import { AdminAuthService } from '../../shared/services/admin-auth.service';
import { AdminWorksService } from '../../shared/services/admin-works.service';
import { AdminProjectsService } from '../../shared/services/admin-projects.service';
import { AdminUser } from '../../shared/models/admin-user.model';
import { StatItem } from '../../shared/components/admin-stats-card/admin-stats-card.component';

@Component({
	selector: 'app-admin-dashboard',
	templateUrl: './admin-dashboard.component.html',
	styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
	currentUser: AdminUser | null = null;
	workStats: any = null;
	projectStats: any = null;
	loading = true;

	// Arrays for stats cards
	workStatsArray: StatItem[] = [];
	projectStatsArray: StatItem[] = [];

	constructor(
		private authService: AdminAuthService,
		private worksService: AdminWorksService,
		private projectsService: AdminProjectsService
	) {}

	ngOnInit(): void {
		console.log('AdminDashboardComponent initialized');
		this.currentUser = this.authService.getCurrentUser();
		console.log('Current user:', this.currentUser);
		this.loadStats();
		this.testApiConnection();
	}

	testApiConnection(): void {
		console.log('Testing API connection...');
		// Probar conexión directa a la API
		fetch('http://127.0.0.1:8000/api/admin/projects/stats')
			.then((response) => response.json())
			.then((data) => {
				console.log('Direct API test successful:', data);
			})
			.catch((error) => {
				console.error('Direct API test failed:', error);
			});
	}

	loadStats(): void {
		console.log('Loading stats...');
		this.loading = true;

		// Cargar estadísticas de trabajos
		this.worksService.getWorkStats().subscribe({
			next: (stats) => {
				console.log('Work stats received:', stats);
				this.workStats = stats;
				this.updateWorkStatsArray();
			},
			error: (error) => {
				console.error('Error loading work stats:', error);
			},
			complete: () => {
				console.log('Work stats loading completed');
				this.loading = false;
			}
		});

		// Cargar estadísticas de proyectos
		this.projectsService.getProjectStats().subscribe({
			next: (stats) => {
				console.log('Project stats received:', stats);
				this.projectStats = stats;
				this.updateProjectStatsArray();
			},
			error: (error) => {
				console.error('Error loading project stats:', error);
			},
			complete: () => {
				console.log('Project stats loading completed');
			}
		});
	}

	private updateWorkStatsArray(): void {
		this.workStatsArray = [
			{
				label: 'Total',
				value: this.workStats?.total || 0
			},
			{
				label: 'Activas',
				value: this.workStats?.active || 0,
				color: '#28a745'
			},
			{
				label: 'Actuales',
				value: this.workStats?.current || 0,
				color: '#17a2b8'
			}
		];
	}

	private updateProjectStatsArray(): void {
		this.projectStatsArray = [
			{
				label: 'Total',
				value: this.projectStats?.total || 0
			},
			{
				label: 'Activos',
				value: this.projectStats?.active || 0,
				color: '#28a745'
			},
			{
				label: 'Destacados',
				value: this.projectStats?.featured || 0,
				color: '#ffc107'
			}
		];
	}

	getUserRoleLabel(): string {
		if (!this.currentUser) return '';
		return this.currentUser.role === 'super_admin'
			? 'Super Administrador'
			: 'Administrador';
	}
}
