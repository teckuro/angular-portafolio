import { Component, Input, OnInit } from '@angular/core';
import { ImageUrlService } from '../../services/image-url.service';

@Component({
	selector: 'app-safe-image',
	template: `
		<img
			[src]="imageSrc"
			[alt]="alt"
			[class]="cssClass"
			(error)="onImageError()"
			(load)="onImageLoad()"
			[style.display]="imageLoaded ? 'block' : 'none'"
		/>
		<div
			*ngIf="!imageLoaded && !hasError"
			[class]="'loading-placeholder ' + cssClass"
			[style.background-color]="placeholderColor"
		>
			<div class="loading-text">{{ placeholderText }}</div>
		</div>
		<div
			*ngIf="hasError"
			[class]="'error-placeholder ' + cssClass"
			[style.background-color]="'#f3f4f6'"
		>
			<div class="error-text">{{ errorText }}</div>
		</div>
	`,
	styles: [
		`
			.loading-placeholder,
			.error-placeholder {
				display: flex;
				align-items: center;
				justify-content: center;
				min-height: 200px;
				border-radius: 8px;
				color: white;
				font-weight: 500;
			}

			.loading-text,
			.error-text {
				text-align: center;
				font-size: 14px;
			}

			.error-placeholder {
				background-color: #f3f4f6 !important;
				color: #6b7280;
			}

			img {
				max-width: 100%;
				height: auto;
				border-radius: 8px;
			}
		`
	]
})
export class SafeImageComponent implements OnInit {
	@Input() src: string = '';
	@Input() alt: string = '';
	@Input() cssClass: string = '';
	@Input() fallbackSrc: string = '';
	@Input() placeholderText: string = 'Cargando...';
	@Input() errorText: string = 'Imagen no disponible';
	@Input() placeholderColor: string = '#3b82f6';

	imageSrc: string = '';
	imageLoaded: boolean = false;
	hasError: boolean = false;

	constructor(private imageUrlService: ImageUrlService) {}

	ngOnInit() {
		this.loadImage();
	}

	loadImage() {
		this.imageLoaded = false;
		this.hasError = false;

		if (!this.src) {
			this.hasError = true;
			return;
		}

		// Verificar si es una URL de placeholder externa
		if (this.src.includes('via.placeholder.com')) {
			this.hasError = true;
			return;
		}

		// Usar el servicio para transformar la URL
		this.imageSrc = this.imageUrlService.transformImageUrl(this.src);

		console.log('Cargando imagen:', this.imageSrc);
	}

	onImageError() {
		this.hasError = true;
		this.imageLoaded = false;

		// Intentar con imagen de respaldo si está disponible
		if (this.fallbackSrc && this.imageSrc !== this.fallbackSrc) {
			this.imageSrc = this.fallbackSrc;
			this.hasError = false;
		}
	}

	onImageLoad() {
		this.imageLoaded = true;
		this.hasError = false;
	}
}
