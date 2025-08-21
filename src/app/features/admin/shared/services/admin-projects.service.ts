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

	constructor(private http: HttpClient) {
		console.log('AdminProjectsService initialized with API URL:', this.API_URL);
	}

	/**
	 * Obtener todos los proyectos
	 */
	getProjects(
		filters: AdminProjectFilters = {}
	): Observable<AdminProjectsResponse> {
		console.log('getProjects called with filters:', filters);
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

		console.log('Making request to:', this.API_URL);
		return this.http
			.get<{ success: boolean; data: AdminProject[] }>(this.API_URL, { params })
			.pipe(
				tap((response) => console.log('Raw API response:', response)),
				map((response) => ({ data: response.data })),
				catchError((error) => {
					console.error('Error in getProjects:', error);
					throw error;
				})
			);
	}

	/**
	 * Obtener un proyecto por ID
	 */
	getProjectById(id: number): Observable<AdminProject> {
		console.log('getProjectById called with id:', id);
		return this.http
			.get<{ success: boolean; data: AdminProject }>(`${this.API_URL}/${id}`)
			.pipe(
				tap((response) =>
					console.log('Raw API response for project:', response)
				),
				map((response) => response.data),
				catchError((error) => {
					console.error('Error in getProjectById:', error);
					throw error;
				})
			);
	}

	/**
	 * Crear un nuevo proyecto
	 */
	createProject(project: AdminProjectCreate): Observable<AdminProject> {
		console.log('createProject called with project:', project);
		return this.http
			.post<{ success: boolean; data: AdminProject }>(this.API_URL, project)
			.pipe(
				tap((response) =>
					console.log('Raw API response for create:', response)
				),
				map((response) => response.data),
				catchError((error) => {
					console.error('Error in createProject:', error);
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
		console.log('updateProject called with id:', id, 'and project:', project);
		return this.http
			.put<{
				success: boolean;
				data: AdminProject;
			}>(`${this.API_URL}/${id}`, project)
			.pipe(
				tap((response) =>
					console.log('Raw API response for update:', response)
				),
				map((response) => response.data),
				catchError((error) => {
					console.error('Error in updateProject:', error);
					throw error;
				})
			);
	}

	/**
	 * Eliminar un proyecto
	 */
	deleteProject(id: number): Observable<any> {
		console.log('deleteProject called with id:', id);
		return this.http
			.delete<{ success: boolean; message: string }>(`${this.API_URL}/${id}`)
			.pipe(
				tap((response) =>
					console.log('Raw API response for delete:', response)
				),
				catchError((error) => {
					console.error('Error in deleteProject:', error);
					throw error;
				})
			);
	}

	/**
	 * Cambiar estado destacado de un proyecto
	 */
	toggleProjectFeatured(id: number): Observable<AdminProject> {
		console.log('toggleProjectFeatured called with id:', id);
		return this.http
			.post<{
				success: boolean;
				data: AdminProject;
			}>(`${this.API_URL}/${id}/toggle-featured`, {})
			.pipe(
				tap((response) =>
					console.log('Raw API response for toggle featured:', response)
				),
				map((response) => response.data),
				catchError((error) => {
					console.error('Error in toggleProjectFeatured:', error);
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
		console.log('getProjectStats called');
		const statsUrl = `${this.API_URL}/stats`;
		console.log('Making request to stats URL:', statsUrl);
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
				tap((response) => console.log('Raw API response for stats:', response)),
				map((response) => response.data),
				catchError((error) => {
					console.error('Error in getProjectStats:', error);
					throw error;
				})
			);
	}
}
