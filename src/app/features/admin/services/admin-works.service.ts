import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
	AdminWork,
	AdminWorkCreate,
	AdminWorkUpdate
} from '../models/admin-work.model';

export interface AdminWorksResponse {
	data: AdminWork[];
	meta: {
		current_page: number;
		last_page: number;
		per_page: number;
		total: number;
	};
}

export interface AdminWorkFilters {
	status?: 'active' | 'inactive' | 'draft';
	is_current?: boolean;
	search?: string;
	page?: number;
	per_page?: number;
}

@Injectable({
	providedIn: 'root'
})
export class AdminWorksService {
	private readonly API_URL = `${environment.apiUrl}/admin/works`;

	constructor(private http: HttpClient) {}

	/**
	 * Obtener todas las experiencias laborales con paginación y filtros
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
		if (filters.page) {
			params = params.set('page', filters.page.toString());
		}
		if (filters.per_page) {
			params = params.set('per_page', filters.per_page.toString());
		}

		return this.http.get<AdminWorksResponse>(this.API_URL, { params });
	}

	/**
	 * Obtener una experiencia laboral por ID
	 */
	getWorkById(id: number): Observable<AdminWork> {
		return this.http.get<AdminWork>(`${this.API_URL}/${id}`);
	}

	/**
	 * Crear una nueva experiencia laboral
	 */
	createWork(work: AdminWorkCreate): Observable<AdminWork> {
		return this.http.post<AdminWork>(this.API_URL, work);
	}

	/**
	 * Actualizar una experiencia laboral existente
	 */
	updateWork(id: number, work: AdminWorkUpdate): Observable<AdminWork> {
		return this.http.put<AdminWork>(`${this.API_URL}/${id}`, work);
	}

	/**
	 * Eliminar una experiencia laboral
	 */
	deleteWork(id: number): Observable<any> {
		return this.http.delete(`${this.API_URL}/${id}`);
	}

	/**
	 * Cambiar estado de una experiencia laboral
	 */
	toggleWorkStatus(
		id: number,
		status: 'active' | 'inactive' | 'draft'
	): Observable<AdminWork> {
		return this.http.patch<AdminWork>(`${this.API_URL}/${id}/status`, {
			status
		});
	}

	/**
	 * Cambiar estado actual de una experiencia laboral
	 */
	toggleWorkCurrent(id: number, is_current: boolean): Observable<AdminWork> {
		return this.http.patch<AdminWork>(`${this.API_URL}/${id}/current`, {
			is_current
		});
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
		return this.http.get<{
			total: number;
			active: number;
			inactive: number;
			draft: number;
			current: number;
		}>(`${this.API_URL}/stats`);
	}

	/**
	 * Obtener experiencias laborales por empresa
	 */
	getWorksByCompany(company: string): Observable<AdminWork[]> {
		return this.http.get<AdminWork[]>(
			`${this.API_URL}/company/${encodeURIComponent(company)}`
		);
	}

	/**
	 * Obtener experiencias laborales por tecnología
	 */
	getWorksByTech(tech: string): Observable<AdminWork[]> {
		return this.http.get<AdminWork[]>(
			`${this.API_URL}/tech/${encodeURIComponent(tech)}`
		);
	}
}
