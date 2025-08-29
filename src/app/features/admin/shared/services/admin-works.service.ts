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

	constructor(private http: HttpClient) {}

	/**
	 * Obtener todas las experiencias laborales
	 */
	getWorks(filters: AdminWorkFilters = {}): Observable<AdminWorksResponse> {
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

		return this.http
			.get<{ success: boolean; data: AdminWork[] }>(this.API_URL, { params })
			.pipe(
				map((response) => ({ data: response.data })),
				catchError((error) => {
					throw error;
				})
			);
	}

	/**
	 * Obtener una experiencia laboral por ID
	 */
	getWorkById(id: number): Observable<AdminWork> {
		return this.http
			.get<{ success: boolean; data: AdminWork }>(`${this.API_URL}/${id}`)
			.pipe(
				map((response) => response.data),
				catchError((error) => {
					throw error;
				})
			);
	}

	/**
	 * Crear una nueva experiencia laboral
	 */
	createWork(work: AdminWorkCreate): Observable<AdminWork> {
		return this.http
			.post<{ success: boolean; data: AdminWork }>(this.API_URL, work)
			.pipe(
				map((response) => response.data),
				catchError((error) => {
					throw error;
				})
			);
	}

	/**
	 * Actualizar una experiencia laboral existente
	 */
	updateWork(id: number, work: AdminWorkUpdate): Observable<AdminWork> {
		return this.http
			.put<{ success: boolean; data: AdminWork }>(`${this.API_URL}/${id}`, work)
			.pipe(
				map((response) => response.data),
				catchError((error) => {
					throw error;
				})
			);
	}

	/**
	 * Eliminar una experiencia laboral
	 */
	deleteWork(id: number): Observable<any> {
		return this.http
			.delete<{ success: boolean; message: string }>(`${this.API_URL}/${id}`)
			.pipe(
				catchError((error) => {
					throw error;
				})
			);
	}

	/**
	 * Cambiar estado actual de una experiencia laboral
	 */
	toggleWorkCurrent(id: number): Observable<AdminWork> {
		return this.http
			.post<{
				success: boolean;
				data: AdminWork;
			}>(`${this.API_URL}/${id}/toggle-current`, {})
			.pipe(
				map((response) => response.data),
				catchError((error) => {
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
		const statsUrl = `${this.API_URL}/stats`;
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
				map((response) => response.data),
				catchError((error) => {
					throw error;
				})
			);
	}
}
