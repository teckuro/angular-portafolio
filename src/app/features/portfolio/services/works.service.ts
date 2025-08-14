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
			company: 'DESIS Facturación Electrónica',
			position: 'Desarrollador Full Stack',
			description:
				'Desarrollador Full Stack con 4 años de experiencia en integraciones de facturación electrónica.',
			startDate: '2021',
			location: 'Santiago, Chile',
			tech: [
				'PHP',
				'PostgreSQL',
				'JavaScript',
				'jQuery',
				'Ajax',
				'GraphQL',
				'Node.js',
				'Git',
				'WebPay REST'
			],
			achievements: [
				'Creación y modificación de interfaces con PHP, PostgreSQL, JavaScript, Ajax, jQuery',
				'Desarrollo de componentes internos de la empresa',
				'Implementación de infraestructura WebPay REST',
				'Gestión del carro de compras de la empresa',
				'Uso de herramientas Git, Node.js, Insomnia, GraphQL',
				'Gestión de requerimientos y documentación técnica'
			],
			isCurrent: true,
			companyUrl: 'https://www.desis.cl'
		},
		{
			id: 2,
			company: 'Anida Tecnología a su medida',
			position: 'Desarrollador Back-end y Front-end',
			description:
				'Desarrollo Back-end y Front-end para procesos de automatización y portal de auto atención.',
			startDate: '2020',
			endDate: '2020',
			location: 'Santiago, Chile',
			tech: ['Laravel', 'Angular', 'PHP', 'JavaScript'],
			achievements: [
				'Desarrollo Back-end con Framework Laravel para automatización de operaciones',
				'Apoyo en el desarrollo del portal de auto atención de Anida Consultores',
				'Desarrollo Front-end con Framework Angular'
			],
			isCurrent: false,
			companyUrl: 'https://www.anidalatam.com'
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
