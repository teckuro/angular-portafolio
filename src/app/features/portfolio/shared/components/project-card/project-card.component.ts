import { Component, Input, OnInit } from '@angular/core';
import { Project } from '../../models/project.model';
import { ImageUrlService } from '../../../../../shared/services/image-url.service';

@Component({
	selector: 'app-project-card',
	templateUrl: './project-card.component.html',
	styleUrls: ['./project-card.component.css']
})
export class ProjectCardComponent implements OnInit {
	@Input() project!: Project;

	// Estados de la imagen
	imageLoading = true;
	imageError = false;
	imageLoaded = false;

	constructor(private imageUrlService: ImageUrlService) {
		// Constructor con inyección de dependencias
	}

	ngOnInit(): void {
		// Inicializar estados de la imagen
		this.imageLoading = true;
		this.imageError = false;
		this.imageLoaded = false;
	}

	/**
	 * Maneja el evento de carga de imagen
	 */
	onImageLoad(): void {
		this.imageLoading = false;
		this.imageLoaded = true;
		this.imageError = false;
	}

	/**
	 * Maneja el evento de error de imagen
	 */
	onImageError(): void {
		this.imageLoading = false;
		this.imageError = true;
		this.imageLoaded = false;
	}

	/**
	 * Obtiene la URL de la imagen con fallback
	 */
	getImageUrl(): string {
		if (this.project?.image_url) {
			// Usar el servicio para transformar la URL si es necesario
			return this.imageUrlService.transformImageUrl(this.project.image_url);
		}
		// URL de placeholder si no hay imagen
		return this.imageUrlService.getDefaultPlaceholderUrl();
	}

	/**
	 * Verifica si el proyecto está destacado
	 */
	isFeatured(): boolean {
		return this.project?.is_featured === true;
	}

	/**
	 * Obtiene el estado del proyecto formateado
	 */
	getProjectStatus(): string {
		if (this.isFeatured()) {
			return 'Destacado';
		}
		return this.project?.status || 'Activo';
	}

	/**
	 * Obtiene las tecnologías limitadas
	 */
	getLimitedTechStack(): string[] {
		if (!this.project?.tech_stack) {
			return [];
		}
		return this.project.tech_stack.slice(0, 4);
	}

	/**
	 * Obtiene el número de tecnologías adicionales
	 */
	getAdditionalTechCount(): number {
		if (!this.project?.tech_stack) {
			return 0;
		}
		return Math.max(0, this.project.tech_stack.length - 4);
	}

	/**
	 * Obtiene la lista de tecnologías ocultas para el tooltip
	 */
	getHiddenTechStack(): string[] {
		if (!this.project?.tech_stack) {
			return [];
		}
		return this.project.tech_stack.slice(4);
	}

	/**
	 * Obtiene las características limitadas
	 */
	getLimitedFeatures(): string[] {
		if (!this.project?.features) {
			return [];
		}
		return this.project.features.slice(0, 3);
	}
}
