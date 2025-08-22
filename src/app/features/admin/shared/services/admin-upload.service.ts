import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';

export interface UploadResponse {
	success: boolean;
	data: {
		filename: string;
		url: string;
		path: string;
	};
	message?: string;
}

export interface ImageInfo {
	filename: string;
	url: string;
	path: string;
	size: number;
	type: string;
	uploadedAt: Date;
}

@Injectable({
	providedIn: 'root'
})
export class AdminUploadService {
	private readonly API_URL = `${environment.apiUrl}/admin/upload`;
	private readonly uploadBasePath = '/assets/uploads';
	private readonly maxFileSize = 5 * 1024 * 1024; // 5MB
	private readonly allowedTypes = [
		'image/jpeg',
		'image/jpg',
		'image/png',
		'image/gif',
		'image/webp'
	];

	constructor(private http: HttpClient) {}

	/**
	 * Valida si un archivo es una imagen válida
	 * @param file - Archivo a validar
	 * @returns true si es válido, false en caso contrario
	 */
	validateImageFile(file: File): { valid: boolean; error?: string } {
		// Validar tipo de archivo
		if (!this.allowedTypes.includes(file.type)) {
			return {
				valid: false,
				error: 'Solo se permiten archivos de imagen (JPG, PNG, GIF, WebP)'
			};
		}

		// Validar tamaño
		if (file.size > this.maxFileSize) {
			return {
				valid: false,
				error: `El archivo es demasiado grande. Máximo ${this.maxFileSize / (1024 * 1024)}MB permitido`
			};
		}

		return { valid: true };
	}

	/**
	 * Genera una vista previa de la imagen
	 * @param file - Archivo de imagen
	 * @returns Promise con la URL de la vista previa
	 */
	generatePreview(file: File): Promise<string> {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onload = (e) => {
				resolve(e.target?.result as string);
			};
			reader.onerror = reject;
			reader.readAsDataURL(file);
		});
	}

	/**
	 * Sube una imagen al servidor
	 * @param file - Archivo de imagen
	 * @param category - Categoría de la imagen (projects, works, etc.)
	 * @returns Observable con la respuesta del servidor
	 */
	uploadImage(
		file: File,
		category: 'projects' | 'works' | 'temp' = 'temp'
	): Observable<UploadResponse> {
		// Validar archivo
		const validation = this.validateImageFile(file);
		if (!validation.valid) {
			return of({
				success: false,
				data: { filename: '', url: '', path: '' },
				message: validation.error
			});
		}

		// Crear FormData
		const formData = new FormData();
		formData.append('image', file);
		formData.append('category', category);

		// Generar nombre único para el archivo
		const timestamp = Date.now();
		const extension = file.name.split('.').pop();
		const filename = `${category}_${timestamp}.${extension}`;

		// Subir a la API real
		return this.uploadToAPI(formData, filename, category);
	}

	/**
	 * Sube el archivo a la API real
	 */
	private uploadToAPI(
		formData: FormData,
		filename: string,
		category: string
	): Observable<UploadResponse> {
		// Agregar la categoría al FormData
		formData.append('category', category);

		console.log('🚀 Subiendo imagen a la API...');

		return this.http.post<UploadResponse>(this.API_URL, formData).pipe(
			map((response) => {
				console.log('✅ ¡Upload exitoso!');
				return response;
			}),
			catchError((error) => {
				console.error('❌ Error en la API:', error.status, error.message);

				// Determinar el tipo de error
				let errorMessage = 'Error al subir la imagen';
				if (error.status === 0) {
					errorMessage =
						'No se puede conectar con la API. Verifica que el servidor esté ejecutándose.';
				} else if (error.status === 413) {
					errorMessage = 'El archivo es demasiado grande';
				} else if (error.status === 415) {
					errorMessage = 'Tipo de archivo no permitido';
				} else if (error.status >= 500) {
					errorMessage = 'Error del servidor. Intenta más tarde.';
				}

				// Solo usar fallback si es absolutamente necesario
				console.log('🔄 Usando fallback local...');
				this.saveFileLocally(formData.get('image') as File, filename, category);

				return of({
					success: true,
					data: {
						filename: filename,
						url: `${this.uploadBasePath}/${category}/${filename}`,
						path: `assets/uploads/${category}/${filename}`
					},
					message: `Imagen guardada localmente. ${errorMessage}`
				});
			})
		);
	}

	/**
	 * Guarda el archivo localmente (solo para desarrollo)
	 */
	private saveFileLocally(
		file: File,
		filename: string,
		category: string
	): void {
		// En desarrollo, convertimos a base64 y lo guardamos en localStorage
		// En producción, esto se manejaría en el backend
		const reader = new FileReader();
		reader.onload = (e) => {
			const base64Data = e.target?.result as string;
			const imageInfo: ImageInfo = {
				filename: filename,
				url: `${this.uploadBasePath}/${category}/${filename}`,
				path: `assets/uploads/${category}/${filename}`,
				size: file.size,
				type: file.type,
				uploadedAt: new Date()
			};

			// Guardar en localStorage para persistencia temporal
			const uploadedImages = JSON.parse(
				localStorage.getItem('uploadedImages') || '[]'
			);
			uploadedImages.push(imageInfo);
			localStorage.setItem('uploadedImages', JSON.stringify(uploadedImages));

			// Guardar la imagen base64
			localStorage.setItem(`image_${filename}`, base64Data);
		};
		reader.readAsDataURL(file);
	}

	/**
	 * Obtiene una imagen guardada
	 * @param filename - Nombre del archivo
	 * @returns Observable con la URL de la imagen
	 */
	getImage(filename: string): Observable<string> {
		const base64Data = localStorage.getItem(`image_${filename}`);
		if (base64Data) {
			return of(base64Data);
		}

		// Si no está en localStorage, usar la URL del servidor Laravel
		const category = this.getCategoryFromFilename(filename);
		const imageUrl = `${environment.apiUrl}/files/${category}/${filename}`;
		return of(imageUrl);
	}

	/**
	 * Extrae la categoría del nombre del archivo
	 */
	private getCategoryFromFilename(filename: string): string {
		const parts = filename.split('_');
		return parts[0] || 'temp';
	}

	/**
	 * Elimina una imagen
	 * @param filename - Nombre del archivo
	 * @returns Observable con el resultado
	 */
	deleteImage(filename: string): Observable<boolean> {
		// Eliminar de localStorage
		localStorage.removeItem(`image_${filename}`);

		// Eliminar de la lista de imágenes subidas
		const uploadedImages = JSON.parse(
			localStorage.getItem('uploadedImages') || '[]'
		);
		const filteredImages = uploadedImages.filter(
			(img: ImageInfo) => img.filename !== filename
		);
		localStorage.setItem('uploadedImages', JSON.stringify(filteredImages));

		return of(true);
	}

	/**
	 * Obtiene todas las imágenes subidas
	 * @returns Observable con la lista de imágenes
	 */
	getUploadedImages(): Observable<ImageInfo[]> {
		const uploadedImages = JSON.parse(
			localStorage.getItem('uploadedImages') || '[]'
		);
		return of(uploadedImages);
	}

	/**
	 * Verifica si la API está disponible
	 * @returns Observable con true si la API está disponible
	 */
	checkAPIAvailability(): Observable<boolean> {
		return this.http.get(`${environment.apiUrl}/health`).pipe(
			map(() => true),
			catchError(() => of(false))
		);
	}

	/**
	 * Obtiene información sobre el estado de la API
	 * @returns Observable con información del estado
	 */
	getAPIStatus(): Observable<{ available: boolean; message: string }> {
		return this.checkAPIAvailability().pipe(
			map((available) => ({
				available,
				message: available
					? 'API disponible - Las imágenes se guardarán en el servidor'
					: 'API no disponible - Las imágenes se guardarán localmente'
			}))
		);
	}

	/**
	 * Carga una imagen existente por URL
	 * @param imageUrl - URL de la imagen
	 * @returns Observable con la imagen base64 o URL
	 */
	loadExistingImage(imageUrl: string): Observable<string> {
		// Si ya es una URL completa válida, usarla directamente
		if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
			return of(imageUrl);
		}

		// Si es una URL de nuestro sistema pero no completa, buscar en localStorage
		if (
			imageUrl.includes(this.uploadBasePath) ||
			imageUrl.includes('storage/assets/uploads')
		) {
			const filename = imageUrl.split('/').pop();
			if (filename) {
				const base64Data = localStorage.getItem(`image_${filename}`);
				if (base64Data) {
					return of(base64Data);
				}

				// Si no está en localStorage, construir URL del servidor
				const category = this.getCategoryFromFilename(filename);
				const serverUrl = `${environment.apiUrl}/files/${category}/${filename}`;
				return of(serverUrl);
			}
		}

		// Si es una URL externa o no encontrada, devolver la URL original
		return of(imageUrl);
	}

	/**
	 * Optimiza una imagen antes de subirla
	 * @param file - Archivo de imagen
	 * @param maxWidth - Ancho máximo
	 * @param maxHeight - Alto máximo
	 * @param quality - Calidad (0-1)
	 * @returns Promise con el archivo optimizado
	 */
	optimizeImage(
		file: File,
		maxWidth: number = 1200,
		maxHeight: number = 800,
		quality: number = 0.8
	): Promise<File> {
		return new Promise((resolve) => {
			const canvas = document.createElement('canvas');
			const ctx = canvas.getContext('2d');
			const img = new Image();

			img.onload = () => {
				// Calcular nuevas dimensiones
				let { width, height } = img;

				if (width > maxWidth) {
					height = (height * maxWidth) / width;
					width = maxWidth;
				}

				if (height > maxHeight) {
					width = (width * maxHeight) / height;
					height = maxHeight;
				}

				// Configurar canvas
				canvas.width = width;
				canvas.height = height;

				// Dibujar imagen optimizada
				ctx?.drawImage(img, 0, 0, width, height);

				// Convertir a blob
				canvas.toBlob(
					(blob) => {
						if (blob) {
							const optimizedFile = new File([blob], file.name, {
								type: file.type,
								lastModified: Date.now()
							});
							resolve(optimizedFile);
						} else {
							resolve(file);
						}
					},
					file.type,
					quality
				);
			};

			img.src = URL.createObjectURL(file);
		});
	}
}
