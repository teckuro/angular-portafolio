import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';
import { Project } from '../models/project.model';

// Datos mock temporales para desarrollo
const MOCK_PROJECTS: Project[] = [
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
		order: 1
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
		order: 2
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
		order: 3
	}
];

@Injectable({
	providedIn: 'root'
})
export class ProjectsService {
	private readonly API_URL = `${environment.apiUrl}/projects`;
	private useMockData = true; // Cambiar a false cuando el backend esté listo

	constructor(private http: HttpClient) {}

	getProjects(): Observable<Project[]> {
		if (this.useMockData) {
			return of(MOCK_PROJECTS).pipe(delay(500));
		}

		return this.http.get<Project[]>(this.API_URL);
	}

	getProjectById(id: number): Observable<Project> {
		if (this.useMockData) {
			const project = MOCK_PROJECTS.find((p) => p.id === id);
			if (project) {
				return of(project).pipe(delay(300));
			} else {
				throw new Error('Project not found');
			}
		}

		return this.http.get<Project>(`${this.API_URL}/${id}`);
	}

	getFeaturedProjects(): Observable<Project[]> {
		if (this.useMockData) {
			const featuredProjects = MOCK_PROJECTS.filter(
				(p) => p.is_featured && p.status === 'active'
			);
			return of(featuredProjects).pipe(delay(300));
		}

		return this.http.get<Project[]>(
			`${this.API_URL}?featured=true&status=active`
		);
	}

	getActiveProjects(): Observable<Project[]> {
		if (this.useMockData) {
			const activeProjects = MOCK_PROJECTS.filter((p) => p.status === 'active');
			return of(activeProjects).pipe(delay(300));
		}

		return this.http.get<Project[]>(`${this.API_URL}?status=active`);
	}

	getProjectsByTech(tech: string): Observable<Project[]> {
		if (this.useMockData) {
			const projects = MOCK_PROJECTS.filter((p) =>
				p.tech_stack.some((t) => t.toLowerCase().includes(tech.toLowerCase()))
			);
			return of(projects).pipe(delay(300));
		}

		return this.http.get<Project[]>(
			`${this.API_URL}?tech=${encodeURIComponent(tech)}`
		);
	}

	getProjectsByStatus(status: string): Observable<Project[]> {
		if (this.useMockData) {
			const projects = MOCK_PROJECTS.filter((p) => p.status === status);
			return of(projects).pipe(delay(300));
		}

		return this.http.get<Project[]>(`${this.API_URL}?status=${status}`);
	}
}
