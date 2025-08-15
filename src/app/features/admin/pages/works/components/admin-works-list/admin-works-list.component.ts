import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminWorksService } from '../../../../shared/services/admin-works.service';
import { AdminWork } from '../../../../shared/models/admin-work.model';

@Component({
	selector: 'app-admin-works-list',
	templateUrl: './admin-works-list.component.html',
	styleUrls: ['./admin-works-list.component.css']
})
export class AdminWorksListComponent implements OnInit {
	works: AdminWork[] = [];
	loading = true;
	error: string | null = null;

	constructor(
		private worksService: AdminWorksService,
		private router: Router
	) {}

	ngOnInit(): void {
		this.loadWorks();
	}

	loadWorks(): void {
		this.loading = true;
		this.error = null;

		this.worksService.getWorks().subscribe({
			next: (response: any) => {
				this.works = response.data;
				this.loading = false;
			},
			error: (error: any) => {
				console.error('Error loading works:', error);
				this.error = 'Error al cargar las experiencias laborales';
				this.loading = false;
			}
		});
	}

	createNewWork(): void {
		this.router.navigate(['/admin/works/new']);
	}

	editWork(workId: number): void {
		this.router.navigate(['/admin/works/edit', workId]);
	}

	deleteWork(workId: number): void {
		if (
			confirm('¿Estás seguro de que quieres eliminar esta experiencia laboral?')
		) {
			this.worksService.deleteWork(workId).subscribe({
				next: () => {
					this.loadWorks(); // Recargar la lista
				},
				error: (error: any) => {
					console.error('Error deleting work:', error);
					alert('Error al eliminar la experiencia laboral');
				}
			});
		}
	}

	toggleWorkStatus(work: AdminWork): void {
		const newStatus = work.status === 'active' ? 'inactive' : 'active';
		this.worksService.toggleWorkStatus(work.id, newStatus).subscribe({
			next: () => {
				work.status = newStatus;
			},
			error: (error: any) => {
				console.error('Error updating work status:', error);
				alert('Error al actualizar el estado');
			}
		});
	}
}
