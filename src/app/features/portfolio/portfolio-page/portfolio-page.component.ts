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

	@ViewChildren('section') sections!: QueryList<ElementRef>;

	constructor(
		private projectsService: ProjectsService,
		private worksService: WorksService,
		private elementRef: ElementRef
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
	 * Abre el modal del curriculum con animación
	 */
	openCurriculumModal(): void {
		this.showCurriculumModal = true;
		document.body.style.overflow = 'hidden'; // Previene scroll del body

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
}
