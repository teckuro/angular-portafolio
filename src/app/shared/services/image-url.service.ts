import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
	providedIn: 'root'
})
export class ImageUrlService {
	constructor() {}

	/**
	 * Transforma una URL de imagen del backend a una URL que funciona en Railway
	 */
	transformImageUrl(imageUrl: string): string {
		if (!imageUrl) {
			return this.getPlaceholderUrl('projects', 1);
		}

		// Si ya es una URL completa que funciona, devolverla tal como está
		if (
			imageUrl.includes('/api/placeholder/') ||
			imageUrl.includes('/api/serve-file')
		) {
			return imageUrl;
		}

		// Si es una URL relativa que comienza con /api/files/, transformarla
		if (imageUrl.startsWith('/api/files/')) {
			return this.transformApiFilesUrl(imageUrl);
		}

		// Si es una URL completa que incluye la API de Railway pero con /api/files/
		if (imageUrl.includes('/api/files/')) {
			return this.transformApiFilesUrl(imageUrl);
		}

		// Si es una URL relativa que comienza con /storage/, convertirla a la API
		if (imageUrl.startsWith('/storage/')) {
			return this.transformStorageUrl(imageUrl);
		}

		// Si es una URL completa que incluye /storage/, convertirla a la API
		if (imageUrl.includes('/storage/')) {
			return this.transformStorageUrl(imageUrl);
		}

		// Para cualquier otra URL, intentar usar la ruta de serve-file
		return this.getServeFileUrl(imageUrl);
	}

	/**
	 * Transforma URLs que usan /api/files/ a rutas que funcionan
	 */
	private transformApiFilesUrl(url: string): string {
		// Extraer la ruta después de /api/files/
		const pathMatch = url.match(/\/api\/files\/(.+)/);
		if (!pathMatch) {
			return this.getPlaceholderUrl('projects', 1);
		}

		const path = pathMatch[1];
		const parts = path.split('/');

		if (parts.length >= 2) {
			const category = parts[0]; // projects, works, temp
			const filename = parts[1];

			// Si es un placeholder, usar la ruta específica
			if (filename.startsWith('placeholder')) {
				const numberMatch = filename.match(/placeholder(\d+)/);
				if (numberMatch) {
					const number = numberMatch[1];
					return this.getPlaceholderUrl(category, parseInt(number));
				}
			}

			// Para otros archivos, usar serve-file temporalmente
			return this.getServeFileUrl(path);
		}

		return this.getPlaceholderUrl('projects', 1);
	}

	/**
	 * Transforma URLs que usan /storage/ a rutas de la API
	 */
	private transformStorageUrl(url: string): string {
		// Extraer la ruta después de /storage/
		const pathMatch = url.match(/\/storage\/(.+)/);
		if (!pathMatch) {
			return this.getPlaceholderUrl('projects', 1);
		}

		const path = pathMatch[1];
		return this.getServeFileUrl(path);
	}

	/**
	 * Obtiene la URL de una imagen placeholder específica
	 */
	getPlaceholderUrl(category: string, number: number): string {
		return `${environment.apiUrl}/placeholder/${category}/${number}`;
	}

	/**
	 * Obtiene la URL de serve-file para una ruta específica
	 */
	getServeFileUrl(path: string): string {
		return `${environment.apiUrl}/serve-file/${path}`;
	}

	/**
	 * Obtiene una URL de placeholder por defecto
	 */
	getDefaultPlaceholderUrl(): string {
		return this.getPlaceholderUrl('projects', 1);
	}

	/**
	 * Verifica si una URL es válida y accesible
	 */
	isImageUrlValid(url: string): boolean {
		return (
			!!url &&
			(url.includes('/api/placeholder/') ||
				url.includes('/api/serve-file') ||
				url.startsWith('http') ||
				url.startsWith('data:'))
		);
	}
}
