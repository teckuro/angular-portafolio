import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminProjectsService } from '../../../../shared/services/admin-projects.service';
import { AdminProject } from '../../../../shared/models/admin-project.model';

@Component({
	selector: 'app-admin-projects-list',
	templateUrl: './admin-projects-list.component.html',
	styleUrls: ['./admin-projects-list.component.css']
})
export class AdminProjectsListComponent implements OnInit {
	projects: AdminProject[] = [];
	loading = true;
	error: string | null = null;

	constructor(
		private projectsService: AdminProjectsService,
		private router: Router
	) {}

	ngOnInit(): void {
		this.loadProjects();
	}

	loadProjects(): void {
		this.loading = true;
		this.error = null;

		this.projectsService.getProjects().subscribe({
			next: (response: any) => {
				this.projects = response.data;
				this.loading = false;
			},
			error: (error: any) => {
				console.error('Error loading projects:', error);
				this.error = 'Error al cargar los proyectos';
				this.loading = false;
			}
		});
	}

	createNewProject(): void {
		this.router.navigate(['/admin/projects/new']);
	}

	editProject(projectId: number): void {
		this.router.navigate(['/admin/projects/edit', projectId]);
	}

	deleteProject(projectId: number): void {
		if (confirm('¿Estás seguro de que quieres eliminar este proyecto?')) {
			this.projectsService.deleteProject(projectId).subscribe({
				next: () => {
					this.loadProjects(); // Recargar la lista
				},
				error: (error: any) => {
					console.error('Error deleting project:', error);
					alert('Error al eliminar el proyecto');
				}
			});
		}
	}

	toggleProjectFeatured(project: AdminProject): void {
		this.projectsService.toggleProjectFeatured(project.id).subscribe({
			next: (updatedProject: AdminProject) => {
				project.is_featured = updatedProject.is_featured;
			},
			error: (error: any) => {
				console.error('Error updating project featured status:', error);
				alert('Error al actualizar el estado destacado');
			}
		});
	}

	getStatusLabel(status: string): string {
		const statusMap: { [key: string]: string } = {
			active: 'Activo',
			inactive: 'Inactivo',
			draft: 'Borrador'
		};
		return statusMap[status] || status;
	}

	getStatusClass(status: string): string {
		const classMap: { [key: string]: string } = {
			active: 'status-active',
			inactive: 'status-inactive',
			draft: 'status-draft'
		};
		return classMap[status] || '';
	}
}
