import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminWorksService } from '../../../../shared/services/admin-works.service';
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
				console.log('Work loaded:', work);
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
				console.error('Error loading work:', error);
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
			console.error('Error formatting date:', dateString, error);
			return '';
		}
	}

	onSubmit(): void {
		if (this.workForm.valid) {
			this.saving = true;
			this.error = null;

			const formData = this.workForm.value;
			console.log('Form data:', formData);

			// Si es trabajo actual, no incluir fecha de fin y debe ser activo
			if (formData.is_current) {
				formData.end_date = null;
				formData.status = 'active';
			}

			const workData: AdminWorkCreate = {
				position: formData.position,
				company: formData.company,
				location: formData.location,
				start_date: formData.start_date,
				end_date: formData.end_date,
				description: formData.description,
				tech: formData.tech || [],
				achievements: formData.achievements || [],
				is_current: formData.is_current,
				company_url: formData.company_url || '',
				status: formData.status
			};

			console.log('Work data to send:', workData);

			const request =
				this.isEditMode && this.workId
					? this.worksService.updateWork(this.workId, {
							...workData,
							id: this.workId
						})
					: this.worksService.createWork(workData);

			request.subscribe({
				next: (response: any) => {
					console.log('Success response:', response);
					this.saving = false;
					this.router.navigate(['/admin/works']);
				},
				error: (error: any) => {
					console.error('Error saving work:', error);
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
}
