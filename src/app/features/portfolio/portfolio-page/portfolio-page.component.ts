import { Component, OnInit, HostListener } from '@angular/core';
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
export class PortfolioPageComponent implements OnInit {
	projects$: Observable<Project[]> = new Observable();
	works$: Observable<Work[]> = new Observable();
	activeSection = 'about';
	showCurriculumModal = false;
	constructor(
		private projectsService: ProjectsService,
		private worksService: WorksService
	) {
		// Constructor vacío intencional
	}

	ngOnInit(): void {
		this.loadProjects();
		this.loadWorks();
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
	 * Navega a una sección específica
	 */
	scrollToSection(sectionId: string): void {
		const element = document.getElementById(sectionId);
		if (element) {
			element.scrollIntoView({ behavior: 'smooth' });
			// Pequeño delay para asegurar que el scroll se complete
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
	 * Abre el modal del curriculum
	 */
	openCurriculumModal(): void {
		this.showCurriculumModal = true;
		document.body.style.overflow = 'hidden'; // Previene scroll del body
	}

	/**
	 * Cierra el modal del curriculum
	 */
	closeCurriculumModal(): void {
		this.showCurriculumModal = false;
		document.body.style.overflow = 'auto'; // Restaura scroll del body
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
}
