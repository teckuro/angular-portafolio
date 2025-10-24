import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminWorksService } from '../../../../shared/services/admin-works.service';
import { SelectOption } from '../../../../shared/components/custom-select/custom-select.component';
import {
	AdminWork,
	AdminWorkCreate
} from '../../../../shared/models/admin-work.model';

@Component({
	selector: 'app-admin-work-form',
	templateUrl: './admin-work-form.component.html',
	styleUrls: ['./admin-work-form.component.css']
})
export class AdminWorkFormComponent implements OnInit {
	workForm: FormGroup;
	loading = false;
	saving = false;
	error: string | null = null;
	isEditMode = false;
	workId: number | null = null;

	// Opciones para el select de status
	statusOptions: SelectOption[] = [
		{ value: 'active', label: 'Activa' },
		{ value: 'inactive', label: 'Inactiva' },
		{ value: 'draft', label: 'Borrador' }
	];

	constructor(
		private fb: FormBuilder,
		private worksService: AdminWorksService,
		private route: ActivatedRoute,
		private router: Router
	) {
		this.workForm = this.createForm();
	}

	ngOnInit(): void {
		this.route.params.subscribe((params) => {
			if (params['id']) {
				this.isEditMode = true;
				this.workId = +params['id'];
				this.loadWork(this.workId);
			} else {
				// Modo creación - no cargar datos
				this.loading = false;
			}
		});
	}

	private createForm(): FormGroup {
		return this.fb.group({
			position: ['', [Validators.required, Validators.minLength(2)]],
			company: ['', [Validators.required, Validators.minLength(2)]],
			location: ['', [Validators.required]],
			start_date: ['', [Validators.required]],
			end_date: [''],
			description: ['', [Validators.required, Validators.minLength(10)]],
			tech: [[]],
			achievements: [[]],
			is_current: [false],
			company_url: [''],
			status: ['active']
		});
	}

	private loadWork(workId: number): void {
		this.loading = true;
		this.error = null;

		this.worksService.getWorkById(workId).subscribe({
			next: (work: AdminWork) => {
				this.workForm.patchValue({
					position: work.position,
					company: work.company,
					location: work.location,
					start_date: this.formatDateForInput(work.start_date),
					end_date: work.end_date ? this.formatDateForInput(work.end_date) : '',
					description: work.description,
					tech: work.tech || [],
					achievements: work.achievements || [],
					is_current: work.is_current,
					company_url: work.company_url || '',
					status: work.status
				});
				this.loading = false;
			},
			error: (error: any) => {
				this.error = 'Error al cargar la experiencia laboral';
				this.loading = false;
			}
		});
	}

	private formatDateForInput(dateString: string): string {
		try {
			const date = new Date(dateString);
			return date.toISOString().split('T')[0];
		} catch (error) {
			return '';
		}
	}

	onSubmit(): void {
		if (this.workForm.valid) {
			this.saving = true;
			this.error = null;

			const formData = this.workForm.value;

			// Sanitizar strings base
			const sanitize = (v: any) => (typeof v === 'string' ? v.trim() : v);
			formData.position = sanitize(formData.position);
			formData.company = sanitize(formData.company);
			formData.location = sanitize(formData.location);
			formData.description = sanitize(formData.description);
			formData.company_url = sanitize(formData.company_url);

			// Si es trabajo actual, no incluir fecha de fin y debe ser activo
			if (formData.is_current) {
				formData.end_date = null;
				formData.status = 'active';
			}

			// Normalizar arrays
			const tech: string[] = (formData.tech || [])
				.map((v: any) => (typeof v === 'string' ? v.trim() : ''))
				.filter((v: string) => v.length > 0);
			const achievements: string[] = (formData.achievements || [])
				.map((v: any) => (typeof v === 'string' ? v.trim() : ''))
				.filter((v: string) => v.length > 0);

			const workData: AdminWorkCreate = {
				position: formData.position,
				company: formData.company,
				location: formData.location,
				start_date: formData.start_date,
				end_date: formData.end_date,
				description: formData.description,
				tech,
				achievements,
				is_current: formData.is_current,
				company_url: formData.company_url || '',
				status: formData.status
			};

			const request =
				this.isEditMode && this.workId
					? this.worksService.updateWork(this.workId, {
							...workData,
							id: this.workId
						})
					: this.worksService.createWork(workData);

			request.subscribe({
				next: (response: any) => {
					this.saving = false;
					this.router.navigate(['/admin/works']);
				},
				error: (error: any) => {
					this.error = 'Error al guardar la experiencia laboral';
					this.saving = false;
				}
			});
		} else {
			this.markFormGroupTouched();
		}
	}

	onCancel(): void {
		this.router.navigate(['/admin/works']);
	}

	toggleCurrentWork(): void {
		const isCurrent = this.workForm.get('is_current')?.value;
		const endDateControl = this.workForm.get('end_date');
		const statusControl = this.workForm.get('status');

		if (isCurrent) {
			endDateControl?.disable();
			endDateControl?.setValue('');
			// Si es trabajo actual, automáticamente debe ser activo
			statusControl?.setValue('active');
		} else {
			endDateControl?.enable();
		}
	}

	private markFormGroupTouched(): void {
		Object.keys(this.workForm.controls).forEach((key) => {
			const control = this.workForm.get(key);
			control?.markAsTouched();
		});
	}

	isFieldInvalid(fieldName: string): boolean {
		const field = this.workForm.get(fieldName);
		return !!(field && field.invalid && field.touched);
	}

	getFieldError(fieldName: string): string {
		const field = this.workForm.get(fieldName);
		if (field && field.errors) {
			if (field.errors['required']) return 'Este campo es requerido';
			if (field.errors['minlength'])
				return `Mínimo ${field.errors['minlength'].requiredLength} caracteres`;
		}
		return '';
	}

	// Métodos para manejar tecnologías
	addTech(input: HTMLInputElement): void {
		const value = input.value.trim();
		if (value) {
			const techArray = this.workForm.get('tech')?.value || [];
			if (!techArray.includes(value)) {
				techArray.push(value);
				this.workForm.get('tech')?.setValue([...techArray]);
			}
			input.value = '';
		}
	}

	removeTech(index: number): void {
		const techArray = this.workForm.get('tech')?.value || [];
		techArray.splice(index, 1);
		this.workForm.get('tech')?.setValue([...techArray]);
	}

	// Métodos para manejar logros
	addAchievement(input: HTMLInputElement): void {
		const value = input.value.trim();
		if (value) {
			const achievementsArray = this.workForm.get('achievements')?.value || [];
			if (!achievementsArray.includes(value)) {
				achievementsArray.push(value);
				this.workForm.get('achievements')?.setValue([...achievementsArray]);
			}
			input.value = '';
		}
	}

	removeAchievement(index: number): void {
		const achievementsArray = this.workForm.get('achievements')?.value || [];
		achievementsArray.splice(index, 1);
		this.workForm.get('achievements')?.setValue([...achievementsArray]);
	}
}
