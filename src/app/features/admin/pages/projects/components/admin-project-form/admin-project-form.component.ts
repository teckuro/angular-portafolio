import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminProjectsService } from '../../../../shared/services/admin-projects.service';
import { SelectOption } from '../../../../shared/components/custom-select/custom-select.component';

@Component({
	selector: 'app-admin-project-form',
	templateUrl: './admin-project-form.component.html',
	styleUrls: ['./admin-project-form.component.css']
})
export class AdminProjectFormComponent implements OnInit {
	projectForm: FormGroup;
	isEditMode = false;
	projectId: number | null = null;
	isLoading = false;
	errorMessage = '';
	successMessage = '';

	// Opciones para el select de status
	statusOptions: SelectOption[] = [
		{ value: 'active', label: 'Activo' },
		{ value: 'inactive', label: 'Inactivo' },
		{ value: 'draft', label: 'Borrador' }
	];

	constructor(
		private fb: FormBuilder,
		private projectsService: AdminProjectsService,
		private route: ActivatedRoute,
		private router: Router
	) {
		this.projectForm = this.fb.group({
			title: ['', [Validators.required, Validators.minLength(2)]],
			short_description: ['', [Validators.required, Validators.minLength(10)]],
			description: ['', [Validators.required, Validators.minLength(20)]],
			image_url: [''],
			project_url: ['', Validators.pattern('https?://.+')],
			github_url: ['', Validators.pattern('https?://.+')],
			status: ['active', Validators.required],
			order: [1, [Validators.required, Validators.min(1)]],
			is_featured: [false],
			tech_stack: this.fb.array([]),
			features: this.fb.array([])
		});
	}

	ngOnInit(): void {
		this.route.params.subscribe((params) => {
			if (params['id']) {
				this.isEditMode = true;
				this.projectId = +params['id'];
				this.loadProject(this.projectId);
			} else {
				// Modo creación - no cargar datos
				this.isLoading = false;
			}
		});
	}

	private loadProject(projectId: number): void {
		this.isLoading = true;
		this.errorMessage = '';

		this.projectsService.getProjectById(projectId).subscribe({
			next: (project: any) => {
				this.projectForm.patchValue({
					title: project.title,
					short_description: project.short_description,
					description: project.description,
					image_url: project.image_url,
					project_url: project.project_url,
					github_url: project.github_url,
					status: project.status,
					is_featured: project.is_featured,
					order: project.order
				});

				// Cargar FormArrays con datos existentes
				this.setArrayValues(
					this.techStackArray,
					Array.isArray(project.tech_stack) ? project.tech_stack : []
				);
				this.setArrayValues(
					this.featuresArray,
					Array.isArray(project.features) ? project.features : []
				);
				this.isLoading = false;
			},
			error: (error: any) => {
				this.errorMessage = 'Error al cargar el proyecto';
				this.isLoading = false;
			}
		});
	}

	onSubmit(): void {
		if (this.projectForm.valid) {
			this.isLoading = true;
			this.errorMessage = '';

			const formData = this.projectForm.value;

			// Normalizar arrays: quitar vacíos y espacios
			const techStack: string[] = (formData.tech_stack || [])
				.map((v: any) => (typeof v === 'string' ? v.trim() : ''))
				.filter((v: string) => v.length > 0);
			const features: string[] = (formData.features || [])
				.map((v: any) => (typeof v === 'string' ? v.trim() : ''))
				.filter((v: string) => v.length > 0);

			const projectData: any = {
				title: formData.title,
				short_description: formData.short_description,
				description: formData.description,
				image_url: formData.image_url,
				project_url: formData.project_url,
				github_url: formData.github_url,
				status: formData.status,
				is_featured: formData.is_featured,
				order: formData.order,
				tech_stack: techStack,
				features: features
			};

			if (this.isEditMode && this.projectId) {
				this.projectsService
					.updateProject(this.projectId, projectData)
					.subscribe({
						next: (response: any) => {
							this.isLoading = false;
							this.router.navigate(['/admin/projects']);
						},
						error: (error: any) => {
							this.errorMessage = 'Error al guardar el proyecto';
							this.isLoading = false;
						}
					});
			} else {
				this.projectsService.createProject(projectData).subscribe({
					next: (response: any) => {
						this.isLoading = false;
						this.router.navigate(['/admin/projects']);
					},
					error: (error: any) => {
						this.errorMessage = 'Error al guardar el proyecto';
						this.isLoading = false;
					}
				});
			}
		}
	}

	private setArrayValues(formArray: FormArray, values: string[]): void {
		formArray.clear();
		values.forEach((value) => {
			const sanitized = typeof value === 'string' ? value.trim() : '';
			if (sanitized.length > 0) {
				formArray.push(this.fb.control(sanitized, Validators.required));
			}
		});
	}

	// Métodos para validación de campos
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
			if (field.errors['pattern']) return 'Formato inválido';
			if (field.errors['min']) return 'El valor mínimo es 1';
		}
		return '';
	}

	// Métodos para manejo de arrays
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

	// Métodos para navegación
	onCancel(): void {
		this.router.navigate(['/admin/projects']);
	}

	// Métodos para manejo de imágenes
	onImageUploadSuccess(imageUrl: string): void {
		// Imagen subida exitosamente
	}

	onImageUploadError(error: string): void {
		// Error al subir imagen
	}
}
