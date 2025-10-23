import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';
import {
	AdminProject,
	AdminProjectCreate,
	AdminProjectUpdate
} from '../models/admin-project.model';

export interface AdminProjectsResponse {
	data: AdminProject[];
}

export interface AdminProjectFilters {
	status?: 'active' | 'inactive' | 'draft';
	is_featured?: boolean;
	search?: string;
}

@Injectable({
	providedIn: 'root'
})
export class AdminProjectsService {
	private readonly API_URL = `${environment.apiUrl}/admin/projects`;

	constructor(private http: HttpClient) {}

	/**
	 * Obtener todos los proyectos
	 */
	getProjects(
		filters: AdminProjectFilters = {}
	): Observable<AdminProjectsResponse> {
		let params = new HttpParams();

		if (filters.status) {
			params = params.set('status', filters.status);
		}
		if (filters.is_featured !== undefined) {
			params = params.set('is_featured', filters.is_featured.toString());
		}
		if (filters.search) {
			params = params.set('search', filters.search);
		}

		return this.http
			.get<{ success: boolean; data: AdminProject[] }>(this.API_URL, { params })
			.pipe(
				map((response) => ({
					data: response.data.map((item) => this.normalizeResponse(item))
				})),
				catchError((error) => {
					throw error;
				})
			);
	}

	/**
	 * Obtener un proyecto por ID
	 */
	getProjectById(id: number): Observable<AdminProject> {
		return this.http
			.get<{ success: boolean; data: AdminProject }>(`${this.API_URL}/${id}`)
			.pipe(
				map((response) => this.normalizeResponse(response.data)),
				catchError((error) => {
					throw error;
				})
			);
	}

	/**
	 * Crear un nuevo proyecto
	 */
	createProject(project: AdminProjectCreate): Observable<AdminProject> {
		// No mapeamos payload aquí; el backend espera tech_stack/features
		return this.http
			.post<{ success: boolean; data: AdminProject }>(this.API_URL, project)
			.pipe(
				map((response) => this.normalizeResponse(response.data)),
				catchError((error) => {
					throw error;
				})
			);
	}

	/**
	 * Actualizar un proyecto existente
	 */
	updateProject(
		id: number,
		project: AdminProjectUpdate
	): Observable<AdminProject> {
		return this.http
			.put<{
				success: boolean;
				data: AdminProject;
			}>(`${this.API_URL}/${id}`, project)
			.pipe(
				map((response) => this.normalizeResponse(response.data)),
				catchError((error) => {
					throw error;
				})
			);
	}

	/**
	 * Eliminar un proyecto
	 */
	deleteProject(id: number): Observable<any> {
		return this.http
			.delete<{ success: boolean; message: string }>(`${this.API_URL}/${id}`)
			.pipe(
				catchError((error) => {
					throw error;
				})
			);
	}

	/**
	 * Cambiar estado destacado de un proyecto
	 */
	toggleProjectFeatured(id: number): Observable<AdminProject> {
		return this.http
			.post<{
				success: boolean;
				data: AdminProject;
			}>(`${this.API_URL}/${id}/toggle-featured`, {})
			.pipe(
				map((response) => response.data),
				catchError((error) => {
					throw error;
				})
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
		const statsUrl = `${this.API_URL}/stats`;
		return this.http
			.get<{
				success: boolean;
				data: {
					total: number;
					active: number;
					inactive: number;
					draft: number;
					featured: number;
				};
			}>(statsUrl)
			.pipe(
				map((response) => response.data),
				catchError((error) => {
					throw error;
				})
			);
	}

	/**
	 * Normaliza tech_stack y features a arrays cuando llegan como JSON string
	 */
	private normalizeResponse(item: any): AdminProject {
        // Alinear posibles nombres de campo del backend
        if ('technologies' in item && !('tech_stack' in item)) {
            item.tech_stack = item.technologies;
        }

        item.tech_stack = this.ensureArray(item.tech_stack);
		item.features = this.ensureArray(item.features);
		return item as AdminProject;
	}

	private ensureArray(value: any): string[] {
		if (Array.isArray(value)) {
			return value;
		}
		if (typeof value === 'string' && value.trim().length > 0) {
			try {
				const parsed = JSON.parse(value);
				return Array.isArray(parsed) ? parsed : [];
			} catch {
				return [];
			}
		}
		return [];
	}
}
