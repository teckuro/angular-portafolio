import { Component, Input, OnInit } from '@angular/core';
import { Project } from '../../models/project.model';

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

	constructor() {
		// Constructor vacío intencional
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
			return this.project.image_url;
		}
		// URL de placeholder si no hay imagen
		return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI4MCIgdmlld0JveD0iMCAwIDQwMCAyODAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMjgwIiBmaWxsPSJ1cmwoI2dyYWRpZW50KSIvPgo8ZGVmcz4KPGxpbmVhckdyYWRpZW50IGlkPSJncmFkaWVudCIgeDE9IjAiIHkxPSIwIiB4Mj0iNDAwIiB5Mj0iMjgwIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CjxzdG9wIG9mZnNldD0iMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiM2NjdlZWE7c3RvcC1vcGFjaXR5OjEiIC8+CjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6Izc2NGJhMjtzdG9wLW9wYWNpdHk6MSIgLz4KPC9saW5lYXJHcmFkaWVudD4KPC9kZWZzPgo8L3N2Zz4K';
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
	 * Obtiene las características limitadas
	 */
	getLimitedFeatures(): string[] {
		if (!this.project?.features) {
			return [];
		}
		return this.project.features.slice(0, 3);
	}
}
