import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminProjectsService } from '../../../../shared/services/admin-projects.service';
import {
	AdminProject,
	AdminProjectCreate
} from '../../../../shared/models/admin-project.model';

@Component({
	selector: 'app-admin-project-form',
	templateUrl: './admin-project-form.component.html',
	styleUrls: ['./admin-project-form.component.css']
})
export class AdminProjectFormComponent implements OnInit {
	projectForm: FormGroup;
	loading = false;
	saving = false;
	error: string | null = null;
	isEditMode = false;
	projectId: number | null = null;

	constructor(
		private fb: FormBuilder,
		private projectsService: AdminProjectsService,
		private route: ActivatedRoute,
		private router: Router
	) {
		this.projectForm = this.createForm();
	}

	ngOnInit(): void {
		this.route.params.subscribe((params) => {
			if (params['id']) {
				this.isEditMode = true;
				this.projectId = +params['id'];
				this.loadProject(this.projectId);
			} else {
				// Modo creación - no cargar datos
				this.loading = false;
			}
		});
	}

	private createForm(): FormGroup {
		return this.fb.group({
			title: ['', [Validators.required, Validators.minLength(3)]],
			short_description: ['', [Validators.required, Validators.minLength(10)]],
			description: ['', [Validators.required, Validators.minLength(20)]],
			image_url: ['', [Validators.required]],
			project_url: [''],
			github_url: [''],
			tech_stack: this.fb.array([]),
			features: this.fb.array([]),
			status: ['active'],
			is_featured: [false],
			order: [1]
		});
	}

	private loadProject(projectId: number): void {
		this.loading = true;
		this.error = null;

		this.projectsService.getProjectById(projectId).subscribe({
			next: (project: AdminProject) => {
				console.log('Project loaded:', project);

				// Limpiar arrays existentes
				this.clearFormArrays();

				// Procesar tech_stack - convertir string JSON a array si es necesario
				let techStack: string[] = [];
				if (typeof project.tech_stack === 'string') {
					try {
						techStack = JSON.parse(project.tech_stack);
					} catch (e) {
						console.error('Error parsing tech_stack JSON:', e);
						techStack = [];
					}
				} else if (Array.isArray(project.tech_stack)) {
					techStack = project.tech_stack;
				}

				// Procesar features - convertir string JSON a array si es necesario
				let features: string[] = [];
				if (typeof project.features === 'string') {
					try {
						features = JSON.parse(project.features);
					} catch (e) {
						console.error('Error parsing features JSON:', e);
						features = [];
					}
				} else if (Array.isArray(project.features)) {
					features = project.features;
				}

				// Agregar tech_stack
				techStack.forEach((tech: string) => {
					this.addTechStack(tech);
				});

				// Agregar features
				features.forEach((feature: string) => {
					this.addFeature(feature);
				});

				this.projectForm.patchValue({
					title: project.title,
					short_description: project.short_description,
					description: project.description,
					image_url: project.image_url,
					project_url: project.project_url || '',
					github_url: project.github_url || '',
					status: project.status,
					is_featured: project.is_featured,
					order: project.order
				});
				this.loading = false;
			},
			error: (error: any) => {
				console.error('Error loading project:', error);
				this.error = 'Error al cargar el proyecto';
				this.loading = false;
			}
		});
	}

	private clearFormArrays(): void {
		while (this.techStackArray.length !== 0) {
			this.techStackArray.removeAt(0);
		}
		while (this.featuresArray.length !== 0) {
			this.featuresArray.removeAt(0);
		}
	}

	get techStackArray(): FormArray {
		return this.projectForm.get('tech_stack') as FormArray;
	}

	get featuresArray(): FormArray {
		return this.projectForm.get('features') as FormArray;
	}

	addTechStack(value: string = ''): void {
		this.techStackArray.push(this.fb.control(value, Validators.required));
	}

	removeTechStack(index: number): void {
		this.techStackArray.removeAt(index);
	}

	addFeature(value: string = ''): void {
		this.featuresArray.push(this.fb.control(value, Validators.required));
	}

	removeFeature(index: number): void {
		this.featuresArray.removeAt(index);
	}

	onSubmit(): void {
		if (this.projectForm.valid) {
			this.saving = true;
			this.error = null;

			const formData = this.projectForm.value;
			console.log('Form data:', formData);

			const projectData: AdminProjectCreate = {
				title: formData.title,
				short_description: formData.short_description,
				description: formData.description,
				image_url: formData.image_url,
				project_url: formData.project_url || undefined,
				github_url: formData.github_url || undefined,
				tech_stack: formData.tech_stack.filter(
					(tech: string) => tech.trim() !== ''
				),
				features: formData.features.filter(
					(feature: string) => feature.trim() !== ''
				),
				status: formData.status,
				is_featured: formData.is_featured,
				order: formData.order
			};

			console.log('Project data to send:', projectData);

			const request =
				this.isEditMode && this.projectId
					? this.projectsService.updateProject(this.projectId, {
							...projectData,
							id: this.projectId
						})
					: this.projectsService.createProject(projectData);

			request.subscribe({
				next: (response: any) => {
					console.log('Success response:', response);
					this.saving = false;
					this.router.navigate(['/admin/projects']);
				},
				error: (error: any) => {
					console.error('Error saving project:', error);
					this.error = 'Error al guardar el proyecto';
					this.saving = false;
				}
			});
		} else {
			this.markFormGroupTouched();
		}
	}

	onCancel(): void {
		this.router.navigate(['/admin/projects']);
	}

	private markFormGroupTouched(): void {
		Object.keys(this.projectForm.controls).forEach((key) => {
			const control = this.projectForm.get(key);
			control?.markAsTouched();
		});
	}

	isFieldInvalid(fieldName: string): boolean {
		const field = this.projectForm.get(fieldName);
		return !!(field && field.invalid && field.touched);
	}

	getFieldError(fieldName: string): string {
		const field = this.projectForm.get(fieldName);
		if (field && field.errors) {
			if (field.errors['required']) return 'Este campo es requerido';
			if (field.errors['minlength'])
				return `Mínimo ${field.errors['minlength'].requiredLength} caracteres`;
		}
		return '';
	}

	/**
	 * Maneja el éxito de la carga de imagen
	 */
	onImageUploadSuccess(imageUrl: string): void {
		console.log('Imagen subida exitosamente:', imageUrl);
		// La URL de la imagen ya se establece automáticamente en el formulario
		// gracias al ControlValueAccessor del componente ImageUpload
	}

	/**
	 * Maneja el error de la carga de imagen
	 */
	onImageUploadError(error: string): void {
		console.error('Error al subir imagen:', error);
		// El error se muestra automáticamente en el componente ImageUpload
	}
}
