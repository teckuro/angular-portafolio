import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';
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
	is_featured?: boolean;
	search?: string;
	page?: number;
	per_page?: number;
}

// Datos mock temporales para desarrollo
const MOCK_PROJECTS: AdminProject[] = [
	{
		id: 1,
		title: 'Portfolio Personal',
		description:
			'Portfolio personal desarrollado con Angular y TypeScript. Incluye un panel de administración completo para gestionar proyectos y experiencias laborales.',
		short_description: 'Portfolio personal con panel de administración',
		image_url:
			'https://via.placeholder.com/400x300/667eea/ffffff?text=Portfolio',
		project_url: 'https://portfolio.com',
		github_url: 'https://github.com/user/portfolio',
		tech_stack: ['Angular', 'TypeScript', 'SCSS', 'RxJS'],
		features: [
			'Panel de administración',
			'CRUD completo',
			'Responsive design',
			'Lazy loading'
		],
		status: 'active',
		is_featured: true,
		order: 1,
		created_at: '2024-01-15T00:00:00Z',
		updated_at: '2024-01-15T00:00:00Z'
	},
	{
		id: 2,
		title: 'E-commerce Platform',
		description:
			'Plataforma de comercio electrónico completa con carrito de compras, gestión de productos, sistema de pagos y panel de administración.',
		short_description: 'Plataforma de e-commerce completa',
		image_url:
			'https://via.placeholder.com/400x300/28a745/ffffff?text=E-commerce',
		project_url: 'https://ecommerce.com',
		github_url: 'https://github.com/user/ecommerce',
		tech_stack: ['React', 'Node.js', 'MongoDB', 'Stripe'],
		features: [
			'Carrito de compras',
			'Sistema de pagos',
			'Panel admin',
			'API REST'
		],
		status: 'active',
		is_featured: true,
		order: 2,
		created_at: '2023-12-01T00:00:00Z',
		updated_at: '2023-12-01T00:00:00Z'
	},
	{
		id: 3,
		title: 'Task Manager App',
		description:
			'Aplicación de gestión de tareas con funcionalidades de drag & drop, categorías, prioridades y notificaciones en tiempo real.',
		short_description: 'Gestor de tareas con drag & drop',
		image_url:
			'https://via.placeholder.com/400x300/ffc107/ffffff?text=Task+Manager',
		project_url: 'https://taskmanager.com',
		github_url: 'https://github.com/user/taskmanager',
		tech_stack: ['Vue.js', 'Firebase', 'Vuex', 'Vuetify'],
		features: ['Drag & drop', 'Categorías', 'Notificaciones', 'Tiempo real'],
		status: 'active',
		is_featured: false,
		order: 3,
		created_at: '2023-10-15T00:00:00Z',
		updated_at: '2023-10-15T00:00:00Z'
	}
];

@Injectable({
	providedIn: 'root'
})
export class AdminProjectsService {
	private readonly API_URL = `${environment.apiUrl}/admin/projects`;
	private useMockData = true; // Cambiar a false cuando el backend esté listo

	constructor(private http: HttpClient) {}

	/**
	 * Obtener todos los proyectos con paginación y filtros
	 */
	getProjects(
		filters: AdminProjectFilters = {}
	): Observable<AdminProjectsResponse> {
		if (this.useMockData) {
			// Simular respuesta paginada
			const response: AdminProjectsResponse = {
				data: MOCK_PROJECTS,
				meta: {
					current_page: 1,
					last_page: 1,
					per_page: 10,
					total: MOCK_PROJECTS.length
				}
			};
			return of(response).pipe(delay(500));
		}

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
		if (this.useMockData) {
			const project = MOCK_PROJECTS.find((p) => p.id === id);
			if (project) {
				return of(project).pipe(delay(300));
			} else {
				throw new Error('Project not found');
			}
		}

		return this.http.get<AdminProject>(`${this.API_URL}/${id}`);
	}

	/**
	 * Crear un nuevo proyecto
	 */
	createProject(project: AdminProjectCreate): Observable<AdminProject> {
		if (this.useMockData) {
			const newProject: AdminProject = {
				...project,
				id: Math.max(...MOCK_PROJECTS.map((p) => p.id)) + 1,
				created_at: new Date().toISOString(),
				updated_at: new Date().toISOString()
			};
			MOCK_PROJECTS.push(newProject);
			return of(newProject).pipe(delay(500));
		}

		return this.http.post<AdminProject>(this.API_URL, project);
	}

	/**
	 * Actualizar un proyecto existente
	 */
	updateProject(
		id: number,
		project: AdminProjectUpdate
	): Observable<AdminProject> {
		if (this.useMockData) {
			const index = MOCK_PROJECTS.findIndex((p) => p.id === id);
			if (index !== -1) {
				MOCK_PROJECTS[index] = {
					...MOCK_PROJECTS[index],
					...project,
					updated_at: new Date().toISOString()
				};
				return of(MOCK_PROJECTS[index]).pipe(delay(500));
			} else {
				throw new Error('Project not found');
			}
		}

		return this.http.put<AdminProject>(`${this.API_URL}/${id}`, project);
	}

	/**
	 * Eliminar un proyecto
	 */
	deleteProject(id: number): Observable<any> {
		if (this.useMockData) {
			const index = MOCK_PROJECTS.findIndex((p) => p.id === id);
			if (index !== -1) {
				MOCK_PROJECTS.splice(index, 1);
				return of({ success: true }).pipe(delay(300));
			} else {
				throw new Error('Project not found');
			}
		}

		return this.http.delete(`${this.API_URL}/${id}`);
	}

	/**
	 * Cambiar estado de un proyecto
	 */
	toggleProjectStatus(
		id: number,
		status: 'active' | 'inactive' | 'draft'
	): Observable<AdminProject> {
		if (this.useMockData) {
			const project = MOCK_PROJECTS.find((p) => p.id === id);
			if (project) {
				project.status = status;
				project.updated_at = new Date().toISOString();
				return of(project).pipe(delay(300));
			} else {
				throw new Error('Project not found');
			}
		}

		return this.http.patch<AdminProject>(`${this.API_URL}/${id}/status`, {
			status
		});
	}

	/**
	 * Cambiar estado destacado de un proyecto
	 */
	toggleProjectFeatured(
		id: number,
		is_featured: boolean
	): Observable<AdminProject> {
		if (this.useMockData) {
			const project = MOCK_PROJECTS.find((p) => p.id === id);
			if (project) {
				project.is_featured = is_featured;
				project.updated_at = new Date().toISOString();
				return of(project).pipe(delay(300));
			} else {
				throw new Error('Project not found');
			}
		}

		return this.http.patch<AdminProject>(`${this.API_URL}/${id}/featured`, {
			is_featured
		});
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
		if (this.useMockData) {
			const stats = {
				total: MOCK_PROJECTS.length,
				active: MOCK_PROJECTS.filter((p) => p.status === 'active').length,
				inactive: MOCK_PROJECTS.filter((p) => p.status === 'inactive').length,
				draft: MOCK_PROJECTS.filter((p) => p.status === 'draft').length,
				featured: MOCK_PROJECTS.filter((p) => p.is_featured).length
			};
			return of(stats).pipe(delay(200));
		}

		return this.http.get<{
			total: number;
			active: number;
			inactive: number;
			draft: number;
			featured: number;
		}>(`${this.API_URL}/stats`);
	}

	/**
	 * Obtener proyectos por tecnología
	 */
	getProjectsByTech(tech: string): Observable<AdminProject[]> {
		if (this.useMockData) {
			const projects = MOCK_PROJECTS.filter((p) =>
				p.tech_stack.some((t) => t.toLowerCase().includes(tech.toLowerCase()))
			);
			return of(projects).pipe(delay(300));
		}

		return this.http.get<AdminProject[]>(
			`${this.API_URL}/tech/${encodeURIComponent(tech)}`
		);
	}

	/**
	 * Reordenar proyectos
	 */
	reorderProjects(projectIds: number[]): Observable<any> {
		if (this.useMockData) {
			// Simular reordenamiento
			projectIds.forEach((id, index) => {
				const project = MOCK_PROJECTS.find((p) => p.id === id);
				if (project) {
					project.order = index + 1;
					project.updated_at = new Date().toISOString();
				}
			});
			return of({ success: true }).pipe(delay(300));
		}

		return this.http.post(`${this.API_URL}/reorder`, { projectIds });
	}
}
