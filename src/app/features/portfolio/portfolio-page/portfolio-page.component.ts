import {
	Component,
	OnInit,
	HostListener,
	AfterViewInit,
	ElementRef,
	ViewChildren,
	QueryList
} from '@angular/core';
import { Observable } from 'rxjs';
import { Project } from '../models/project.model';
import { Work } from '../models/work.model';
import { ProjectsService } from '../services/projects.service';
import { WorksService } from '../services/works.service';
import { AnalyticsService } from '../../../core/services/analytics.service';

@Component({
	selector: 'app-portfolio-page',
	templateUrl: './portfolio-page.component.html',
	styleUrls: ['./portfolio-page.component.css']
})
export class PortfolioPageComponent implements OnInit, AfterViewInit {
	projects$: Observable<Project[]> = new Observable();
	works$: Observable<Work[]> = new Observable();
	activeSection = 'about';
	showCurriculumModal = false;

	// Animation states
	headerVisible = false;
	sectionsVisible: { [key: string]: boolean } = {};

	// Analytics tracking
	private startTime = Date.now();
	private lastScrollDepth = 0;

	@ViewChildren('section') sections!: QueryList<ElementRef>;

	constructor(
		private projectsService: ProjectsService,
		private worksService: WorksService,
		private elementRef: ElementRef,
		private analyticsService: AnalyticsService
	) {
		// Constructor vacío intencional
	}

	ngOnInit(): void {
		this.loadProjects();
		this.loadWorks();
		// Trigger header animation after a short delay
		setTimeout(() => {
			this.headerVisible = true;
		}, 300);

		// Track page view
		this.analyticsService.trackPageView('portfolio');
	}

	ngAfterViewInit(): void {
		// Initialize intersection observer for animations
		this.initializeAnimations();
	}

	/**
	 * Inicializa las animaciones de scroll
	 */
	private initializeAnimations(): void {
		if ('IntersectionObserver' in window) {
			const observer = new IntersectionObserver(
				(entries) => {
					entries.forEach((entry) => {
						if (entry.isIntersecting) {
							const sectionId = entry.target.id;
							this.sectionsVisible[sectionId] = true;
							entry.target.classList.add('animate-in');
						}
					});
				},
				{
					threshold: 0.1,
					rootMargin: '0px 0px -50px 0px'
				}
			);

			// Observe all sections
			this.sections.forEach((section) => {
				observer.observe(section.nativeElement);
			});
		}
	}

	/**
	 * Carga los proyectos desde el servicio
	 */
	private loadProjects(): void {
		this.projects$ = this.projectsService.getProjects();
	}

	private loadWorks(): void {
		this.works$ = this.worksService.getWorks();
	}

	/**
	 * Navega a una sección específica con animación suave
	 */
	scrollToSection(sectionId: string): void {
		const element = document.getElementById(sectionId);
		if (element) {
			// Smooth scroll with easing
			element.scrollIntoView({
				behavior: 'smooth',
				block: 'start'
			});

			// Update active section with delay for smooth transition
			setTimeout(() => {
				this.activeSection = sectionId;
				console.log(
					'Navegando a:',
					sectionId,
					'Sección activa:',
					this.activeSection
				);

				// Track section navigation
				this.analyticsService.trackSectionNavigation(sectionId);
			}, 100);
		}
	}

	/**
	 * Escucha el scroll para actualizar la sección activa
	 */
	@HostListener('window:scroll', ['$event'])
	onScroll(): void {
		this.updateActiveSection();
		this.handleScrollAnimations();
		this.trackScrollDepth();
	}

	/**
	 * Actualiza la sección activa basada en la posición del scroll
	 */
	private updateActiveSection(): void {
		const sections = ['about', 'work', 'projects'];
		const scrollPosition = window.scrollY + 100; // Offset para el header sticky

		for (const sectionId of sections) {
			const element = document.getElementById(sectionId);
			if (element) {
				const offsetTop = element.offsetTop;
				const offsetHeight = element.offsetHeight;

				if (
					scrollPosition >= offsetTop &&
					scrollPosition < offsetTop + offsetHeight
				) {
					if (this.activeSection !== sectionId) {
						this.activeSection = sectionId;
						console.log('Sección activa actualizada a:', sectionId);
					}
					break;
				}
			}
		}
	}

	/**
	 * Maneja las animaciones basadas en scroll
	 */
	private handleScrollAnimations(): void {
		const scrollY = window.scrollY;
		const windowHeight = window.innerHeight;

		// Parallax effect for header
		const header = this.elementRef.nativeElement.querySelector('header');
		if (header) {
			const translateY = scrollY * 0.1;
			header.style.transform = `translateY(${translateY}px)`;
		}
	}

	/**
	 * Track scroll depth for analytics
	 */
	private trackScrollDepth(): void {
		const scrollTop = window.scrollY;
		const docHeight =
			document.documentElement.scrollHeight - window.innerHeight;
		const scrollPercent = Math.round((scrollTop / docHeight) * 100);

		// Track every 25% of scroll depth
		if (scrollPercent >= 25 && this.lastScrollDepth < 25) {
			this.analyticsService.trackScrollDepth(25);
			this.lastScrollDepth = 25;
		} else if (scrollPercent >= 50 && this.lastScrollDepth < 50) {
			this.analyticsService.trackScrollDepth(50);
			this.lastScrollDepth = 50;
		} else if (scrollPercent >= 75 && this.lastScrollDepth < 75) {
			this.analyticsService.trackScrollDepth(75);
			this.lastScrollDepth = 75;
		} else if (scrollPercent >= 100 && this.lastScrollDepth < 100) {
			this.analyticsService.trackScrollDepth(100);
			this.lastScrollDepth = 100;
		}
	}

	/**
	 * Abre el modal del curriculum con animación
	 */
	openCurriculumModal(): void {
		this.showCurriculumModal = true;
		document.body.style.overflow = 'hidden'; // Previene scroll del body

		// Track curriculum modal open
		this.analyticsService.trackCustomEvent('curriculum_modal_open');

		// Trigger animation after modal is shown
		setTimeout(() => {
			const modal = document.querySelector('.modal-content');
			if (modal) {
				modal.classList.add('modal-visible');
			}
		}, 10);
	}

	/**
	 * Cierra el modal del curriculum con animación
	 */
	closeCurriculumModal(): void {
		const modal = document.querySelector('.modal-content');
		if (modal) {
			modal.classList.remove('modal-visible');
		}

		// Wait for animation to complete before hiding
		setTimeout(() => {
			this.showCurriculumModal = false;
			document.body.style.overflow = 'auto'; // Restaura scroll del body
		}, 300);
	}

	/**
	 * Descarga el PDF del curriculum
	 */
	downloadPDF(): void {
		// Track curriculum download
		this.analyticsService.trackCurriculumDownload();

		// URL del PDF (debes subir tu archivo PDF a assets)
		const pdfUrl = 'assets/cv-juan-pablo-huerta.pdf';

		// Crear un enlace temporal para descargar
		const link = document.createElement('a');
		link.href = pdfUrl;
		link.download = 'CV-Juan-Pablo-Huerta.pdf';
		link.target = '_blank';

		// Simular click para descargar
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	}

	/**
	 * Obtiene las clases CSS para animaciones
	 */
	getAnimationClasses(sectionId: string): string {
		const baseClasses = 'section-content';
		const visibleClass = this.sectionsVisible[sectionId] ? 'animate-in' : '';
		return `${baseClasses} ${visibleClass}`.trim();
	}

	/**
	 * Track social media clicks
	 */
	trackSocialClick(platform: string): void {
		this.analyticsService.trackSocialMediaClick(platform);
	}

	/**
	 * Track project interactions
	 */
	trackProjectInteraction(projectTitle: string, action: string): void {
		this.analyticsService.trackCustomEvent('project_interaction', {
			project_title: projectTitle,
			action: action
		});
	}

	/**
	 * Track time on page when component is destroyed
	 */
	ngOnDestroy(): void {
		const timeOnPage = Math.round((Date.now() - this.startTime) / 1000);
		this.analyticsService.trackTimeOnPage(timeOnPage);
	}
}
