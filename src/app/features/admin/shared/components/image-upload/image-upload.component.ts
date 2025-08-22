import {
	Component,
	Input,
	Output,
	EventEmitter,
	forwardRef
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { AdminUploadService } from '../../services/admin-upload.service';
import { ImageUrlService } from '../../../../../shared/services/image-url.service';

@Component({
	selector: 'app-image-upload',
	templateUrl: './image-upload.component.html',
	styleUrls: ['./image-upload.component.css'],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => ImageUploadComponent),
			multi: true
		}
	]
})
export class ImageUploadComponent implements ControlValueAccessor {
	@Input() label = 'Imagen del Proyecto';
	@Input() required = false;
	@Input() placeholder = 'Selecciona una imagen...';
	@Input() accept = 'image/*';
	@Input() maxSize = 5; // MB
	@Input() preview = true;
	@Input() multiple = false;
	@Input() category: 'projects' | 'works' | 'temp' = 'temp';

	@Output() uploadStart = new EventEmitter<void>();
	@Output() uploadSuccess = new EventEmitter<string>();
	@Output() uploadError = new EventEmitter<string>();
	@Output() fileSelected = new EventEmitter<File>();

	// ControlValueAccessor properties
	private onChange = (value: string) => {};
	private onTouched = () => {};

	// Component properties
	selectedFile: File | null = null;
	previewUrl: string | null = null;
	uploading = false;
	error: string | null = null;
	uploadProgress = 0;

	constructor(
		private uploadService: AdminUploadService,
		private imageUrlService: ImageUrlService
	) {}

	// ControlValueAccessor implementation
	writeValue(value: string): void {
		if (value) {
			// Transformar la URL para que funcione en Railway
			const transformedUrl = this.imageUrlService.transformImageUrl(value);
			this.previewUrl = transformedUrl;
		}
	}

	registerOnChange(fn: any): void {
		this.onChange = fn;
	}

	registerOnTouched(fn: any): void {
		this.onTouched = fn;
	}

	setDisabledState(isDisabled: boolean): void {
		// Implementar si es necesario
	}

	/**
	 * Maneja la selección de archivos
	 */
	onFileSelected(event: Event): void {
		const input = event.target as HTMLInputElement;
		const files = input.files;

		if (files && files.length > 0) {
			const file = files[0];
			this.handleFileSelection(file);
		}
	}

	/**
	 * Maneja la selección de archivo por drag & drop
	 */
	onFileDrop(event: DragEvent): void {
		event.preventDefault();
		event.stopPropagation();

		const files = event.dataTransfer?.files;
		if (files && files.length > 0) {
			const file = files[0];
			this.handleFileSelection(file);
		}
	}

	/**
	 * Previene el comportamiento por defecto del drag & drop
	 */
	onDragOver(event: DragEvent): void {
		event.preventDefault();
		event.stopPropagation();
	}

	/**
	 * Maneja la selección de archivo
	 */
	private handleFileSelection(file: File): void {
		this.error = null;
		this.selectedFile = file;

		// Validar archivo
		const validation = this.uploadService.validateImageFile(file);
		if (!validation.valid) {
			this.error = validation.error || 'Archivo inválido';
			this.selectedFile = null;
			return;
		}

		// Emitir evento de archivo seleccionado
		this.fileSelected.emit(file);

		// Procesar archivo (generar vista previa y simular carga)
		this.uploadFile();
	}

	/**
	 * Procesa el archivo seleccionado
	 */
	private uploadFile(): void {
		if (!this.selectedFile) return;

		this.uploading = true;
		this.uploadProgress = 0;
		this.uploadStart.emit();

		// Determinar categoría basada en el contexto
		const category = this.getUploadCategory();

		// Optimizar imagen antes de subir
		this.uploadService
			.optimizeImage(this.selectedFile)
			.then((optimizedFile) => {
				// Subir imagen optimizada
				this.uploadService.uploadImage(optimizedFile, category).subscribe({
					next: (response) => {
						if (response.success) {
							this.uploadProgress = 100;

							// Transformar la URL para mostrar en el preview
							const transformedUrl = this.imageUrlService.transformImageUrl(response.data.url);
							this.uploading = false;
							this.previewUrl = transformedUrl;

							// Usar la URL del servidor para el formulario
							this.onChange(response.data.url);
							this.uploadSuccess.emit(response.data.url);
						} else {
							this.uploading = false;
							this.error = response.message || 'Error al subir la imagen';
							this.uploadError.emit(this.error);
						}
					},
					error: (error) => {
						this.uploading = false;
						this.error = 'Error al subir la imagen';
						this.uploadError.emit(this.error);
						console.error('Upload error:', error);
					}
				});
			})
			.catch((error) => {
				this.uploading = false;
				this.error = 'Error al optimizar la imagen';
				this.uploadError.emit(this.error);
				console.error('Optimization error:', error);
			});
	}

	/**
	 * Determina la categoría de upload basada en el contexto
	 */
	private getUploadCategory(): 'projects' | 'works' | 'temp' {
		return this.category;
	}

	/**
	 * Elimina la imagen seleccionada
	 */
	removeImage(): void {
		this.selectedFile = null;
		this.previewUrl = null;
		this.error = null;
		this.uploadProgress = 0;
		this.onChange('');
	}

	/**
	 * Abre el selector de archivos
	 */
	openFileSelector(): void {
		const input = document.createElement('input');
		input.type = 'file';
		input.accept = this.accept;
		input.multiple = this.multiple;
		input.onchange = (event) => {
			const files = (event.target as HTMLInputElement).files;
			if (files && files.length > 0) {
				this.handleFileSelection(files[0]);
			}
		};
		input.click();
	}

	/**
	 * Obtiene el texto del botón según el estado
	 */
	getButtonText(): string {
		if (this.uploading) {
			return `Subiendo... ${this.uploadProgress}%`;
		}
		if (this.previewUrl) {
			return 'Cambiar Imagen';
		}
		return 'Seleccionar Imagen';
	}

	/**
	 * Obtiene las clases CSS del contenedor
	 */
	getContainerClasses(): string {
		let classes = 'image-upload-container';
		if (this.uploading) classes += ' uploading';
		if (this.error) classes += ' error';
		if (this.previewUrl) classes += ' has-preview';
		return classes;
	}
}
