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
	showCurriculumModal = false;

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

		// Cargar experiencias laborales
		this.worksService.getWorks().subscribe({
			next: (works) => {
				this.works = works;
			},
			error: (error) => {
				console.error('Error loading works:', error);
				this.error = 'Error al cargar las experiencias laborales';
			}
		});

		// Cargar proyectos
		this.projectsService.getProjects().subscribe({
			next: (projects) => {
				this.projects = projects;
				this.loading = false;
			},
			error: (error) => {
				console.error('Error loading projects:', error);
				this.error = 'Error al cargar los proyectos';
				this.loading = false;
			}
		});
	}

	getActiveWorks(): Work[] {
		return this.works.filter((work) => work.status === 'active');
	}

	getFeaturedProjects(): Project[] {
		return this.projects.filter(
			(project) => project.is_featured && project.status === 'active'
		);
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

	openCurriculumModal(): void {
		this.showCurriculumModal = true;
	}

	closeCurriculumModal(): void {
		this.showCurriculumModal = false;
	}

	downloadPDF(): void {
		console.log('Descargando PDF del curriculum...');
	}
}
