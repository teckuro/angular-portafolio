import { Component, OnInit } from '@angular/core';
import { WorksService } from '../../shared/services/works.service';
import { ProjectsService } from '../../shared/services/projects.service';
import { Work } from '../../shared/models/work.model';
import { Project } from '../../shared/models/project.model';

@Component({
	selector: 'app-portfolio-page',
	templateUrl: './portfolio-page.component.html',
	styleUrls: ['./portfolio-page.component.css']
})
export class PortfolioPageComponent implements OnInit {
	works: Work[] = [];
	projects: Project[] = [];
	loading = true;
	error: string | null = null;
	headerVisible = true; // Siempre visible desde el inicio
	activeSection = 'about';

	constructor(
		private worksService: WorksService,
		private projectsService: ProjectsService
	) {}

	ngOnInit(): void {
		this.loadData();
		this.setupScrollListener();
	}

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

		// Timeout para evitar que se quede cargando indefinidamente
		setTimeout(() => {
			if (this.loading) {
				console.log('Timeout reached, stopping loading');
				this.loading = false;
				this.error =
					'Tiempo de espera agotado. Verifica tu conexión a internet.';
			}
		}, 10000); // 10 segundos de timeout

		// Cargar experiencias laborales
		this.worksService.getWorks().subscribe({
			next: (works) => {
				console.log('Works loaded successfully:', works);
				this.works = works;
				worksLoaded = true;
				checkAllLoaded();
			},
			error: (error) => {
				console.error('Error loading works:', error);
				this.error = this.getErrorMessage(error, 'experiencias laborales');
				worksLoaded = true;
				checkAllLoaded();
			}
		});

		// Cargar proyectos
		this.projectsService.getProjects().subscribe({
			next: (projects) => {
				console.log('Projects loaded:', projects);
				this.projects = projects;
				projectsLoaded = true;
				checkAllLoaded();
			},
			error: (error) => {
				console.error('Error loading projects:', error);
				this.error = this.getErrorMessage(error, 'proyectos');
				projectsLoaded = true;
				checkAllLoaded();
			}
		});
	}

	private getErrorMessage(error: any, dataType: string): string {
		if (error.status === 0) {
			return `No se pudo conectar con el servidor. Verifica que la API esté ejecutándose en ${error.url}`;
		} else if (error.status === 404) {
			return `No se encontró el endpoint para ${dataType}. Verifica la configuración de la API.`;
		} else if (error.status === 500) {
			return `Error interno del servidor al cargar ${dataType}. Intenta más tarde.`;
		} else {
			return `Error al cargar ${dataType}: ${error.message || 'Error desconocido'}`;
		}
	}

	getActiveWorks(): Work[] {
		return this.works.filter((work) => work.status === 'active');
	}

	getFeaturedProjects(): Project[] {
		console.log('All projects:', this.projects);
		const featured = this.projects.filter(
			(project) => project.is_featured && project.status === 'active'
		);
		console.log('Featured projects:', featured);
		return featured;
	}

	getAllProjects(): Project[] {
		return this.projects.filter((project) => project.status === 'active');
	}

	formatDate(dateString: string): string {
		const date = new Date(dateString);
		return date.toLocaleDateString('es-ES', {
			year: 'numeric',
			month: 'long'
		});
	}

	getDuration(startDate: string, endDate?: string): string {
		const start = new Date(startDate);
		const end = endDate ? new Date(endDate) : new Date();

		const years = end.getFullYear() - start.getFullYear();
		const months = end.getMonth() - start.getMonth();

		let duration = '';

		if (years > 0) {
			duration += `${years} año${years > 1 ? 's' : ''}`;
			if (months > 0) {
				duration += ` ${months} mes${months > 1 ? 'es' : ''}`;
			}
		} else if (months > 0) {
			duration += `${months} mes${months > 1 ? 'es' : ''}`;
		} else {
			duration = 'Menos de 1 mes';
		}

		return duration;
	}

	isCurrentWork(work: Work): boolean {
		return work.is_current;
	}

	getTechStackDisplay(techStack: string[]): string {
		return (
			techStack.slice(0, 3).join(', ') + (techStack.length > 3 ? '...' : '')
		);
	}

	getProjectFeaturesDisplay(features: string[]): string {
		return features.slice(0, 2).join(', ') + (features.length > 2 ? '...' : '');
	}

	openProjectUrl(url: string): void {
		window.open(url, '_blank');
	}

	openGitHubUrl(url: string): void {
		window.open(url, '_blank');
	}

	scrollToSection(sectionId: string): void {
		const element = document.getElementById(sectionId);
		if (element) {
			element.scrollIntoView({ behavior: 'smooth' });
		}
	}

	downloadCV(): void {
		// Implementar descarga de CV
		console.log('Descargando CV...');
	}

	contactMe(): void {
		// Implementar contacto
		console.log('Contactando...');
	}

	// Métodos para el HTML original
	setupScrollListener(): void {
		window.addEventListener('scroll', () => {
			this.updateActiveSection();
			this.updateHeaderVisibility();
		});
	}

	updateActiveSection(): void {
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

	updateHeaderVisibility(): void {
		this.headerVisible = true; // Siempre visible, no depende del scroll
	}

	getAnimationClasses(section: string): string {
		return `animate-${section}`;
	}

	trackSocialClick(platform: string): void {
		console.log(`Social click tracked: ${platform}`);
	}

	downloadPDF(): void {
		console.log('Descargando PDF del curriculum...');
		// Aquí puedes implementar la lógica de descarga del PDF
		// Por ejemplo, crear un enlace temporal y hacer clic en él
		const link = document.createElement('a');
		link.href = '/assets/cv-juan-pablo-huerta.pdf'; // Ruta al archivo PDF
		link.download = 'CV-Juan-Pablo-Huerta.pdf';
		link.target = '_blank';
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	}
}
