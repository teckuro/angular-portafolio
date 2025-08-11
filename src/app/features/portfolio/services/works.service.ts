import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Work } from '../models/work.model';

@Injectable({
	providedIn: 'root'
})
export class WorksService {
	private works: Work[] = [
		{
			id: 1,
			company: 'TechCorp Solutions',
			position: 'Senior Frontend Developer',
			description:
				'Desarrollo de aplicaciones web modernas con Angular y React',
			startDate: '2023',
			endDate: '2024',
			location: 'Madrid, España',
			tech: ['Angular', 'React', 'TypeScript', 'Node.js'],
			achievements: [
				'Lideré el desarrollo de 3 aplicaciones web críticas',
				'Mejoré el rendimiento en un 40%',
				'Mentoré a 2 desarrolladores junior'
			],
			isCurrent: false,
			companyUrl: 'https://techcorp.com'
		},
		{
			id: 2,
			company: 'Digital Innovations',
			position: 'Full Stack Developer',
			description: 'Desarrollo full-stack con tecnologías modernas',
			startDate: '2022',
			endDate: '2023',
			location: 'Barcelona, España',
			tech: ['JavaScript', 'Python', 'Django', 'PostgreSQL'],
			achievements: [
				'Desarrollé 5 APIs RESTful',
				'Implementé sistema de autenticación',
				'Optimicé consultas de base de datos'
			],
			isCurrent: false,
			companyUrl: 'https://digitalinnovations.com'
		},
		{
			id: 3,
			company: 'StartUpXYZ',
			position: 'Frontend Developer',
			description: 'Desarrollo de interfaces de usuario modernas y responsivas',
			startDate: '2021',
			endDate: '2022',
			location: 'Valencia, España',
			tech: ['Vue.js', 'CSS3', 'HTML5', 'JavaScript'],
			achievements: [
				'Creé 10+ componentes reutilizables',
				'Implementé diseño responsive',
				'Reduje tiempo de carga en 30%'
			],
			isCurrent: false,
			companyUrl: 'https://startupxyz.com'
		},
		{
			id: 4,
			company: 'Innovation Labs',
			position: 'Software Engineer',
			description: 'Desarrollo de soluciones innovadoras para clientes',
			startDate: '2024',
			location: 'Madrid, España',
			tech: ['Angular', 'TypeScript', 'RxJS', 'Firebase'],
			achievements: [
				'Desarrollo de aplicaciones escalables',
				'Implementación de arquitectura limpia',
				'Colaboración en equipo ágil'
			],
			isCurrent: true,
			companyUrl: 'https://innovationlabs.com'
		}
	];

	constructor() {
		// Constructor vacío intencional para servicio
	}

	/**
	 * Obtiene todas las experiencias laborales
	 */
	getWorks(): Observable<Work[]> {
		return of(this.works);
	}

	/**
	 * Obtiene una experiencia laboral por ID
	 */
	getWorkById(id: number): Observable<Work | undefined> {
		const work = this.works.find((w) => w.id === id);
		return of(work);
	}

	/**
	 * Obtiene trabajos actuales
	 */
	getCurrentWorks(): Observable<Work[]> {
		const currentWorks = this.works.filter((work) => work.isCurrent);
		return of(currentWorks);
	}

	/**
	 * Obtiene trabajos por tecnología
	 */
	getWorksByTech(tech: string): Observable<Work[]> {
		const filteredWorks = this.works.filter((work) =>
			work.tech.some((t) => t.toLowerCase().includes(tech.toLowerCase()))
		);
		return of(filteredWorks);
	}

	/**
	 * Obtiene trabajos por empresa
	 */
	getWorksByCompany(company: string): Observable<Work[]> {
		const filteredWorks = this.works.filter((work) =>
			work.company.toLowerCase().includes(company.toLowerCase())
		);
		return of(filteredWorks);
	}

	/**
	 * Agrega una nueva experiencia laboral
	 */
	addWork(work: Omit<Work, 'id'>): Observable<Work> {
		const newWork: Work = {
			...work,
			id: Math.max(...this.works.map((w) => w.id)) + 1
		};
		this.works.push(newWork);
		return of(newWork);
	}

	/**
	 * Actualiza una experiencia laboral
	 */
	updateWork(id: number, work: Partial<Work>): Observable<Work | undefined> {
		const index = this.works.findIndex((w) => w.id === id);
		if (index !== -1) {
			this.works[index] = { ...this.works[index], ...work };
			return of(this.works[index]);
		}
		return of(undefined);
	}

	/**
	 * Elimina una experiencia laboral
	 */
	deleteWork(id: number): Observable<boolean> {
		const index = this.works.findIndex((w) => w.id === id);
		if (index !== -1) {
			this.works.splice(index, 1);
			return of(true);
		}
		return of(false);
	}
}
