import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Project } from '../models/project.model';

@Injectable({
	providedIn: 'root'
})
export class ProjectsService {
	private projects: Project[] = [
		{
			id: 1,
			title: 'E-commerce Platform',
			description:
				'Aplicación completa de comercio electrónico con Angular y Node.js',
			date: '2024',
			tech: ['Angular', 'Node.js', 'MongoDB'],
			image: '🛒',
			demoLink: 'https://demo-ecommerce.com',
			codeLink: 'https://github.com/tu-usuario/ecommerce-app'
		},
		{
			id: 2,
			title: 'Task Manager App',
			description: 'Aplicación de gestión de tareas con React y Firebase',
			date: '2024',
			tech: ['React', 'Firebase', 'TypeScript'],
			image: '📱',
			demoLink: 'https://task-manager-demo.com',
			codeLink: 'https://github.com/tu-usuario/task-manager'
		},
		{
			id: 3,
			title: 'Portfolio Website',
			description: 'Sitio web personal con diseño moderno y responsive',
			date: '2024',
			tech: ['HTML', 'CSS', 'JavaScript'],
			image: '🎨',
			demoLink: 'https://mi-portfolio.com',
			codeLink: 'https://github.com/tu-usuario/portfolio'
		},
		{
			id: 4,
			title: 'Weather App',
			description: 'Aplicación del clima con API de OpenWeatherMap',
			date: '2023',
			tech: ['Angular', 'TypeScript', 'REST API'],
			image: '🌤️',
			demoLink: 'https://weather-app-demo.com',
			codeLink: 'https://github.com/tu-usuario/weather-app'
		},
		{
			id: 5,
			title: 'Blog Platform',
			description: 'Plataforma de blog con sistema de autenticación',
			date: '2023',
			tech: ['React', 'Node.js', 'PostgreSQL'],
			image: '📝',
			demoLink: 'https://blog-platform.com',
			codeLink: 'https://github.com/tu-usuario/blog-platform'
		}
	];

	constructor() {
		// Constructor vacío intencional para servicio
	}

	/**
	 * Obtiene todos los proyectos
	 */
	getProjects(): Observable<Project[]> {
		return of(this.projects);
	}

	/**
	 * Obtiene un proyecto por ID
	 */
	getProjectById(id: number): Observable<Project | undefined> {
		const project = this.projects.find((p) => p.id === id);
		return of(project);
	}

	/**
	 * Obtiene proyectos por tecnología
	 */
	getProjectsByTech(tech: string): Observable<Project[]> {
		const filteredProjects = this.projects.filter((project) =>
			project.tech.some((t) => t.toLowerCase().includes(tech.toLowerCase()))
		);
		return of(filteredProjects);
	}

	/**
	 * Agrega un nuevo proyecto
	 */
	addProject(project: Omit<Project, 'id'>): Observable<Project> {
		const newProject: Project = {
			...project,
			id: Math.max(...this.projects.map((p) => p.id)) + 1
		};
		this.projects.push(newProject);
		return of(newProject);
	}
}
