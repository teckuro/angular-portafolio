import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
	AdminProject,
	AdminProjectCreate,
	AdminProjectUpdate
} from '../models/admin-project.model';

export interface AdminProjectsResponse {
	data: AdminProject[];
	meta: {
		current_page: number;
		last_page: number;
		per_page: number;
		total: number;
	};
}

export interface AdminProjectFilters {
	status?: 'active' | 'inactive' | 'draft';
	featured?: boolean;
	search?: string;
	page?: number;
	per_page?: number;
}

@Injectable({
	providedIn: 'root'
})
export class AdminProjectsService {
	private readonly API_URL = `${environment.apiUrl}/admin/projects`;

	constructor(private http: HttpClient) {}

	/**
	 * Obtener todos los proyectos con paginación y filtros
	 */
	getProjects(
		filters: AdminProjectFilters = {}
	): Observable<AdminProjectsResponse> {
		let params = new HttpParams();

		if (filters.status) {
			params = params.set('status', filters.status);
		}
		if (filters.featured !== undefined) {
			params = params.set('featured', filters.featured.toString());
		}
		if (filters.search) {
			params = params.set('search', filters.search);
		}
		if (filters.page) {
			params = params.set('page', filters.page.toString());
		}
		if (filters.per_page) {
			params = params.set('per_page', filters.per_page.toString());
		}

		return this.http.get<AdminProjectsResponse>(this.API_URL, { params });
	}

	/**
	 * Obtener un proyecto por ID
	 */
	getProjectById(id: number): Observable<AdminProject> {
		return this.http.get<AdminProject>(`${this.API_URL}/${id}`);
	}

	/**
	 * Crear un nuevo proyecto
	 */
	createProject(project: AdminProjectCreate): Observable<AdminProject> {
		return this.http.post<AdminProject>(this.API_URL, project);
	}

	/**
	 * Actualizar un proyecto existente
	 */
	updateProject(
		id: number,
		project: AdminProjectUpdate
	): Observable<AdminProject> {
		return this.http.put<AdminProject>(`${this.API_URL}/${id}`, project);
	}

	/**
	 * Eliminar un proyecto
	 */
	deleteProject(id: number): Observable<any> {
		return this.http.delete(`${this.API_URL}/${id}`);
	}

	/**
	 * Cambiar estado de un proyecto
	 */
	toggleProjectStatus(
		id: number,
		status: 'active' | 'inactive' | 'draft'
	): Observable<AdminProject> {
		return this.http.patch<AdminProject>(`${this.API_URL}/${id}/status`, {
			status
		});
	}

	/**
	 * Cambiar estado destacado de un proyecto
	 */
	toggleProjectFeatured(
		id: number,
		featured: boolean
	): Observable<AdminProject> {
		return this.http.patch<AdminProject>(`${this.API_URL}/${id}/featured`, {
			featured
		});
	}

	/**
	 * Subir imagen para un proyecto
	 */
	uploadProjectImage(
		id: number,
		file: File
	): Observable<{ image_url: string }> {
		const formData = new FormData();
		formData.append('image', file);

		return this.http.post<{ image_url: string }>(
			`${this.API_URL}/${id}/image`,
			formData
		);
	}

	/**
	 * Obtener estadísticas de proyectos
	 */
	getProjectStats(): Observable<{
		total: number;
		active: number;
		inactive: number;
		draft: number;
		featured: number;
	}> {
		return this.http.get<{
			total: number;
			active: number;
			inactive: number;
			draft: number;
			featured: number;
		}>(`${this.API_URL}/stats`);
	}
}
