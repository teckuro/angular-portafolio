import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';
import {
	AdminWork,
	AdminWorkCreate,
	AdminWorkUpdate
} from '../models/admin-work.model';

export interface AdminWorksResponse {
	data: AdminWork[];
}

export interface AdminWorkFilters {
	status?: 'active' | 'inactive' | 'draft';
	is_current?: boolean;
	search?: string;
}

@Injectable({
	providedIn: 'root'
})
export class AdminWorksService {
	private readonly API_URL = `${environment.apiUrl}/admin/works`;

	constructor(private http: HttpClient) {
		console.log('AdminWorksService initialized with API URL:', this.API_URL);
	}

	/**
	 * Obtener todas las experiencias laborales
	 */
	getWorks(filters: AdminWorkFilters = {}): Observable<AdminWorksResponse> {
		console.log('getWorks called with filters:', filters);
		let params = new HttpParams();

		if (filters.status) {
			params = params.set('status', filters.status);
		}
		if (filters.is_current !== undefined) {
			params = params.set('is_current', filters.is_current.toString());
		}
		if (filters.search) {
			params = params.set('search', filters.search);
		}

		console.log('Making request to:', this.API_URL);
		return this.http
			.get<{ success: boolean; data: AdminWork[] }>(this.API_URL, { params })
			.pipe(
				tap((response) => console.log('Raw API response:', response)),
				map((response) => ({ data: response.data })),
				catchError((error) => {
					console.error('Error in getWorks:', error);
					throw error;
				})
			);
	}

	/**
	 * Obtener una experiencia laboral por ID
	 */
	getWorkById(id: number): Observable<AdminWork> {
		console.log('getWorkById called with id:', id);
		return this.http
			.get<{ success: boolean; data: AdminWork }>(`${this.API_URL}/${id}`)
			.pipe(
				tap((response) => console.log('Raw API response for work:', response)),
				map((response) => response.data),
				catchError((error) => {
					console.error('Error in getWorkById:', error);
					throw error;
				})
			);
	}

	/**
	 * Crear una nueva experiencia laboral
	 */
	createWork(work: AdminWorkCreate): Observable<AdminWork> {
		console.log('createWork called with work:', work);
		return this.http
			.post<{ success: boolean; data: AdminWork }>(this.API_URL, work)
			.pipe(
				tap((response) =>
					console.log('Raw API response for create:', response)
				),
				map((response) => response.data),
				catchError((error) => {
					console.error('Error in createWork:', error);
					throw error;
				})
			);
	}

	/**
	 * Actualizar una experiencia laboral existente
	 */
	updateWork(id: number, work: AdminWorkUpdate): Observable<AdminWork> {
		console.log('updateWork called with id:', id, 'and work:', work);
		return this.http
			.put<{ success: boolean; data: AdminWork }>(`${this.API_URL}/${id}`, work)
			.pipe(
				tap((response) =>
					console.log('Raw API response for update:', response)
				),
				map((response) => response.data),
				catchError((error) => {
					console.error('Error in updateWork:', error);
					throw error;
				})
			);
	}

	/**
	 * Eliminar una experiencia laboral
	 */
	deleteWork(id: number): Observable<any> {
		console.log('deleteWork called with id:', id);
		return this.http
			.delete<{ success: boolean; message: string }>(`${this.API_URL}/${id}`)
			.pipe(
				tap((response) =>
					console.log('Raw API response for delete:', response)
				),
				catchError((error) => {
					console.error('Error in deleteWork:', error);
					throw error;
				})
			);
	}

	/**
	 * Cambiar estado actual de una experiencia laboral
	 */
	toggleWorkCurrent(id: number): Observable<AdminWork> {
		console.log('toggleWorkCurrent called with id:', id);
		return this.http
			.post<{
				success: boolean;
				data: AdminWork;
			}>(`${this.API_URL}/${id}/toggle-current`, {})
			.pipe(
				tap((response) =>
					console.log('Raw API response for toggle current:', response)
				),
				map((response) => response.data),
				catchError((error) => {
					console.error('Error in toggleWorkCurrent:', error);
					throw error;
				})
			);
	}

	/**
	 * Obtener estadísticas de experiencias laborales
	 */
	getWorkStats(): Observable<{
		total: number;
		active: number;
		inactive: number;
		draft: number;
		current: number;
	}> {
		console.log('getWorkStats called');
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
					current: number;
				};
			}>(statsUrl)
			.pipe(
				tap((response) => console.log('Raw API response for stats:', response)),
				map((response) => response.data),
				catchError((error) => {
					console.error('Error in getWorkStats:', error);
					throw error;
				})
			);
	}
}
