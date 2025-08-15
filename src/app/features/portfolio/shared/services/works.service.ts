import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';
import { Work } from '../models/work.model';

// Datos mock temporales para desarrollo
const MOCK_WORKS: Work[] = [
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
		status: 'active'
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
		status: 'active'
	}
];

@Injectable({
	providedIn: 'root'
})
export class WorksService {
	private readonly API_URL = `${environment.apiUrl}/works`;
	private useMockData = true; // Cambiar a false cuando el backend esté listo

	constructor(private http: HttpClient) {}

	getWorks(): Observable<Work[]> {
		if (this.useMockData) {
			return of(MOCK_WORKS).pipe(delay(500));
		}

		return this.http.get<Work[]>(this.API_URL);
	}

	getWorkById(id: number): Observable<Work> {
		if (this.useMockData) {
			const work = MOCK_WORKS.find((w) => w.id === id);
			if (work) {
				return of(work).pipe(delay(300));
			} else {
				throw new Error('Work not found');
			}
		}

		return this.http.get<Work>(`${this.API_URL}/${id}`);
	}

	getActiveWorks(): Observable<Work[]> {
		if (this.useMockData) {
			const activeWorks = MOCK_WORKS.filter((w) => w.status === 'active');
			return of(activeWorks).pipe(delay(300));
		}

		return this.http.get<Work[]>(`${this.API_URL}?status=active`);
	}

	getCurrentWork(): Observable<Work | null> {
		if (this.useMockData) {
			const currentWork = MOCK_WORKS.find((w) => w.is_current);
			return of(currentWork || null).pipe(delay(200));
		}

		return this.http.get<Work>(`${this.API_URL}/current`);
	}

	getWorksByCompany(company: string): Observable<Work[]> {
		if (this.useMockData) {
			const works = MOCK_WORKS.filter((w) =>
				w.company.toLowerCase().includes(company.toLowerCase())
			);
			return of(works).pipe(delay(300));
		}

		return this.http.get<Work[]>(
			`${this.API_URL}?company=${encodeURIComponent(company)}`
		);
	}

	getWorksByTech(tech: string): Observable<Work[]> {
		if (this.useMockData) {
			const works = MOCK_WORKS.filter((w) =>
				w.tech.some((t) => t.toLowerCase().includes(tech.toLowerCase()))
			);
			return of(works).pipe(delay(300));
		}

		return this.http.get<Work[]>(
			`${this.API_URL}?tech=${encodeURIComponent(tech)}`
		);
	}
}
