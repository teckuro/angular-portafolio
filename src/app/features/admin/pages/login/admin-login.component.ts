import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AdminAuthService } from '../../shared/services/admin-auth.service';
import { environment } from '../../../../../environments/environment';

@Component({
	selector: 'app-admin-login',
	templateUrl: './admin-login.component.html',
	styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent implements OnInit {
	loginForm: FormGroup;
	loading = false;
	error = '';
	returnUrl = '/admin/dashboard';

	constructor(
		private formBuilder: FormBuilder,
		private authService: AdminAuthService,
		private router: Router,
		private route: ActivatedRoute
	) {
		this.loginForm = this.formBuilder.group({
			email: ['', [Validators.required, Validators.email]],
			password: ['', [Validators.required, Validators.minLength(6)]]
		});
	}

	ngOnInit(): void {
		// Si ya está autenticado, redirigir al dashboard
		if (this.authService.isAuthenticated()) {
			this.authService.navigateAfterLogin(this.returnUrl);
			return;
		}

		// Obtener URL de retorno si existe
		this.returnUrl =
			this.route.snapshot.queryParams['returnUrl'] || '/admin/dashboard';
	}

	onSubmit(): void {
		if (this.loginForm.valid) {
			this.loading = true;
			this.error = '';

			const credentials = this.loginForm.value;

			this.authService.login(credentials).subscribe({
				next: (response) => {
					this.loading = false;

					// Verificar que el estado se haya actualizado correctamente
					const isAuth = this.authService.isAuthenticated();

					if (isAuth) {
						// Usar setTimeout para asegurar que el estado se haya propagado
						setTimeout(() => {
							this.router
								.navigate([this.returnUrl], { replaceUrl: true })
								.catch((error) => {
									// Fallback: intentar navegar al dashboard
									this.router
										.navigate(['/admin/dashboard'], { replaceUrl: true })
										.catch(() => {
											this.authService.forceNavigation(this.returnUrl);
										});
								});
						}, 100);
					} else {
						this.error = 'Error en la autenticación. Intente nuevamente.';
					}
				},
				error: (error) => {
					this.loading = false;

					if (error.status === 0) {
						this.error =
							'No se pudo conectar con el servidor. Verifica tu conexión a internet.';
					} else if (error.status === 422) {
						this.error = error.error?.message || 'Credenciales inválidas';
					} else if (error.status === 500) {
						this.error = 'Error interno del servidor. Intenta más tarde.';
					} else {
						this.error = error.error?.message || 'Error al iniciar sesión';
					}
				}
			});
		}
	}

	getErrorMessage(field: string): string {
		const control = this.loginForm.get(field);
		if (control?.hasError('required')) {
			return 'Este campo es requerido';
		}
		if (control?.hasError('email')) {
			return 'Ingrese un email válido';
		}
		if (control?.hasError('minlength')) {
			return 'La contraseña debe tener al menos 6 caracteres';
		}
		return '';
	}
}
