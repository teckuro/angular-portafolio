import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';
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

// Datos mock temporales para desarrollo
const MOCK_WORKS: AdminWork[] = [
	{
		id: 1,
		company: 'Tech Solutions',
		position: 'Desarrollador Frontend',
		description:
			'Desarrollo de aplicaciones web modernas usando Angular, React y Vue.js. Trabajo en equipo con metodologías ágiles.',
		start_date: '2023-01-15',
		end_date: undefined,
		location: 'Madrid, España',
		tech: ['Angular', 'React', 'TypeScript', 'JavaScript'],
		achievements: [
			'Mejoré el rendimiento en un 40%',
			'Implementé nuevas funcionalidades'
		],
		is_current: true,
		company_url: 'https://techsolutions.com',
		status: 'active',
		created_at: '2023-01-15T00:00:00Z',
		updated_at: '2023-01-15T00:00:00Z'
	},
	{
		id: 2,
		company: 'Digital Innovations',
		position: 'Desarrollador Full Stack',
		description:
			'Desarrollo completo de aplicaciones web desde el frontend hasta el backend.',
		start_date: '2022-06-01',
		end_date: '2022-12-31',
		location: 'Barcelona, España',
		tech: ['Node.js', 'Express', 'MongoDB', 'React'],
		achievements: [
			'Lideré un equipo de 3 desarrolladores',
			'Completé 5 proyectos exitosos'
		],
		is_current: false,
		company_url: 'https://digitalinnovations.com',
		status: 'active',
		created_at: '2022-06-01T00:00:00Z',
		updated_at: '2022-12-31T00:00:00Z'
	}
];

@Injectable({
	providedIn: 'root'
})
export class AdminWorksService {
	private readonly API_URL = `${environment.apiUrl}/admin/works`;
	private useMockData = true; // Cambiar a false cuando el backend esté listo

	constructor(private http: HttpClient) {}

	/**
	 * Obtener todas las experiencias laborales con paginación y filtros
	 */
	getWorks(filters: AdminWorkFilters = {}): Observable<AdminWorksResponse> {
		if (this.useMockData) {
			// Simular respuesta paginada
			const response: AdminWorksResponse = {
				data: MOCK_WORKS,
				meta: {
					current_page: 1,
					last_page: 1,
					per_page: 10,
					total: MOCK_WORKS.length
				}
			};
			return of(response).pipe(delay(500)); // Simular delay de red
		}

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
		if (this.useMockData) {
			const work = MOCK_WORKS.find((w) => w.id === id);
			if (work) {
				return of(work).pipe(delay(300)); // Simular delay de red
			} else {
				throw new Error('Work not found');
			}
		}

		return this.http.get<AdminWork>(`${this.API_URL}/${id}`);
	}

	/**
	 * Crear una nueva experiencia laboral
	 */
	createWork(work: AdminWorkCreate): Observable<AdminWork> {
		if (this.useMockData) {
			const newWork: AdminWork = {
				...work,
				id: Math.max(...MOCK_WORKS.map((w) => w.id)) + 1,
				created_at: new Date().toISOString(),
				updated_at: new Date().toISOString()
			};
			MOCK_WORKS.push(newWork);
			return of(newWork).pipe(delay(500));
		}

		return this.http.post<AdminWork>(this.API_URL, work);
	}

	/**
	 * Actualizar una experiencia laboral existente
	 */
	updateWork(id: number, work: AdminWorkUpdate): Observable<AdminWork> {
		if (this.useMockData) {
			const index = MOCK_WORKS.findIndex((w) => w.id === id);
			if (index !== -1) {
				MOCK_WORKS[index] = {
					...MOCK_WORKS[index],
					...work,
					updated_at: new Date().toISOString()
				};
				return of(MOCK_WORKS[index]).pipe(delay(500));
			} else {
				throw new Error('Work not found');
			}
		}

		return this.http.put<AdminWork>(`${this.API_URL}/${id}`, work);
	}

	/**
	 * Eliminar una experiencia laboral
	 */
	deleteWork(id: number): Observable<any> {
		if (this.useMockData) {
			const index = MOCK_WORKS.findIndex((w) => w.id === id);
			if (index !== -1) {
				MOCK_WORKS.splice(index, 1);
				return of({ success: true }).pipe(delay(300));
			} else {
				throw new Error('Work not found');
			}
		}

		return this.http.delete(`${this.API_URL}/${id}`);
	}

	/**
	 * Cambiar estado de una experiencia laboral
	 */
	toggleWorkStatus(
		id: number,
		status: 'active' | 'inactive' | 'draft'
	): Observable<AdminWork> {
		if (this.useMockData) {
			const work = MOCK_WORKS.find((w) => w.id === id);
			if (work) {
				work.status = status;
				work.updated_at = new Date().toISOString();
				return of(work).pipe(delay(300));
			} else {
				throw new Error('Work not found');
			}
		}

		return this.http.patch<AdminWork>(`${this.API_URL}/${id}/status`, {
			status
		});
	}

	/**
	 * Cambiar estado actual de una experiencia laboral
	 */
	toggleWorkCurrent(id: number, is_current: boolean): Observable<AdminWork> {
		if (this.useMockData) {
			const work = MOCK_WORKS.find((w) => w.id === id);
			if (work) {
				work.is_current = is_current;
				work.updated_at = new Date().toISOString();
				return of(work).pipe(delay(300));
			} else {
				throw new Error('Work not found');
			}
		}

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
		if (this.useMockData) {
			const stats = {
				total: MOCK_WORKS.length,
				active: MOCK_WORKS.filter((w) => w.status === 'active').length,
				inactive: MOCK_WORKS.filter((w) => w.status === 'inactive').length,
				draft: MOCK_WORKS.filter((w) => w.status === 'draft').length,
				current: MOCK_WORKS.filter((w) => w.is_current).length
			};
			return of(stats).pipe(delay(200));
		}

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
		if (this.useMockData) {
			const works = MOCK_WORKS.filter((w) =>
				w.company.toLowerCase().includes(company.toLowerCase())
			);
			return of(works).pipe(delay(300));
		}

		return this.http.get<AdminWork[]>(
			`${this.API_URL}/company/${encodeURIComponent(company)}`
		);
	}

	/**
	 * Obtener experiencias laborales por tecnología
	 */
	getWorksByTech(tech: string): Observable<AdminWork[]> {
		if (this.useMockData) {
			const works = MOCK_WORKS.filter((w) =>
				w.tech.some((t) => t.toLowerCase().includes(tech.toLowerCase()))
			);
			return of(works).pipe(delay(300));
		}

		return this.http.get<AdminWork[]>(
			`${this.API_URL}/tech/${encodeURIComponent(tech)}`
		);
	}
}
