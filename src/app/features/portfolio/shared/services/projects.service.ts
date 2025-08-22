import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BaseApiService } from '../../../../core/services/base-api.service';
import { Project } from '../models/project.model';

@Injectable({
	providedIn: 'root'
})
export class ProjectsService extends BaseApiService<Project> {
	protected readonly endpoint = 'projects';

	constructor(http: HttpClient) {
		super(http);
	}

	/**
	 * Transforma los datos específicos de Project
	 */
	protected transformData(project: any): Project {
		// Transformar campos JSON a arrays
		this.transformJsonField(project, 'tech_stack');
		this.transformJsonField(project, 'features');

		return project as Project;
	}

	/**
	 * Obtiene proyectos activos
	 */
	getActiveProjects(): Observable<Project[]> {
		return this.getByStatus('active');
	}

	/**
	 * Obtiene proyectos destacados
	 */
	getFeaturedProjects(): Observable<Project[]> {
		return this.http
			.get<{ success: boolean; data: Project[] }>(`${this.apiUrl}/featured`)
			.pipe(
				map((response) => response.data.map((item) => this.transformData(item)))
			);
	}

	/**
	 * Obtiene proyectos por tecnología
	 */
	getProjectsByTech(tech: string): Observable<Project[]> {
		return this.http
			.get<{
				success: boolean;
				data: Project[];
			}>(`${this.apiUrl}?tech=${encodeURIComponent(tech)}`)
			.pipe(
				map((response) => response.data.map((item) => this.transformData(item)))
			);
	}
}
