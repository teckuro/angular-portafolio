import { Component, OnInit, OnDestroy } from '@angular/core';
import { WorksService } from '../../shared/services/works.service';
import { ProjectsService } from '../../shared/services/projects.service';
import { Work } from '../../shared/models/work.model';
import { Project } from '../../shared/models/project.model';

@Component({
	selector: 'app-portfolio-page',
	templateUrl: './portfolio-page.component.html',
	styleUrls: ['./portfolio-page.component.css']
})
export class PortfolioPageComponent implements OnInit, OnDestroy {
	// Propiedades principales
	works: Work[] = [];
	projects: Project[] = [];
	loading = true;
	error: string | null = null;
	headerVisible = true;
	activeSection = 'about';

	// Propiedades privadas
	private scrollListener: (() => void) | null = null;

	constructor(
		private worksService: WorksService,
		private projectsService: ProjectsService
	) {}

	ngOnInit(): void {
		this.loadData();
		this.setupScrollListener();
	}

	ngOnDestroy(): void {
		// Limpiar el listener de scroll al destruir el componente
		if (this.scrollListener) {
			window.removeEventListener('scroll', this.scrollListener);
		}
	}

	// Métodos de carga de datos
	loadData(): void {
		this.loading = true;
		this.error = null;

		let worksLoaded = false;
		let projectsLoaded = false;

		const checkAllLoaded = () => {
			if (worksLoaded && projectsLoaded) {
				this.loading = false;
			}
		};

		// Timeout de seguridad
		setTimeout(() => {
			if (this.loading) {
				this.loading = false;
				this.error =
					'Tiempo de espera agotado. Verifica tu conexión a internet.';
			}
		}, 10000);

			// Cargar experiencias laborales
	this.worksService.getAll().subscribe({
		next: (works) => {
			this.works = works;
			worksLoaded = true;
			checkAllLoaded();
		},
		error: (error) => {
			this.error = this.getErrorMessage(error, 'experiencias laborales');
			worksLoaded = true;
			checkAllLoaded();
		}
	});

	// Cargar proyectos
	this.projectsService.getAll().subscribe({
		next: (projects) => {
			this.projects = projects;
			projectsLoaded = true;
			checkAllLoaded();
		},
		error: (error) => {
			this.error = this.getErrorMessage(error, 'proyectos');
			projectsLoaded = true;
			checkAllLoaded();
		}
	});
	}

	// Métodos de filtrado de datos
	getActiveWorks(): Work[] {
		return this.works.filter((work) => work.status === 'active');
	}

	getAllProjects(): Project[] {
		return this.projects.filter((project) => project.status === 'active');
	}

	// Métodos de navegación
	scrollToSection(sectionId: string): void {
		const element = document.getElementById(sectionId);
		if (element) {
			element.scrollIntoView({ behavior: 'smooth' });
		}
	}

	// Métodos de utilidad
	getAnimationClasses(section: string): string {
		return `animate-${section}`;
	}

	trackSocialClick(platform: string): void {
		console.log(`Social click tracked: ${platform}`);
	}

	downloadPDF(): void {
		const link = document.createElement('a');
		link.href = '/assets/cv-juan-pablo-huerta.pdf';
		link.download = 'CV-Juan-Pablo-Huerta.pdf';
		link.target = '_blank';
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	}

	// Métodos privados
	private getErrorMessage(error: any, dataType: string): string {
		if (error.status === 0) {
			return `No se pudo conectar con el servidor. Verifica que la API esté ejecutándose.`;
		} else if (error.status === 404) {
			return `No se encontró el endpoint para ${dataType}. Verifica la configuración de la API.`;
		} else if (error.status === 500) {
			return `Error interno del servidor al cargar ${dataType}. Intenta más tarde.`;
		} else {
			return `Error al cargar ${dataType}: ${error.message || 'Error desconocido'}`;
		}
	}

	private setupScrollListener(): void {
		this.scrollListener = () => {
			this.updateActiveSection();
		};
		window.addEventListener('scroll', this.scrollListener);
	}

	private updateActiveSection(): void {
		const sections = ['about', 'work', 'projects'];
		const scrollPosition = window.scrollY + 100;

		for (const section of sections) {
			const element = document.getElementById(section);
			if (element) {
				const offsetTop = element.offsetTop;
				const offsetHeight = element.offsetHeight;

				if (
					scrollPosition >= offsetTop &&
					scrollPosition < offsetTop + offsetHeight
				) {
					this.activeSection = section;
					break;
				}
			}
		}
	}
}
