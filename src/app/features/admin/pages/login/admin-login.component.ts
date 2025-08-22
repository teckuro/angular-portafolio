import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AdminAuthService } from '../../shared/services/admin-auth.service';

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
			this.router.navigate([this.returnUrl]);
		}

		// Obtener URL de retorno si existe
		this.returnUrl =
			this.route.snapshot.queryParams['returnUrl'] || '/admin/dashboard';
	}

	onSubmit(): void {
		if (this.loginForm.valid) {
			this.loading = true;
			this.error = '';

			console.log('Intentando login con:', this.loginForm.value);

			this.authService.login(this.loginForm.value).subscribe({
				next: (response) => {
					console.log('Login exitoso, redirigiendo a:', this.returnUrl);
					this.loading = false;
					this.router.navigate([this.returnUrl]);
				},
				error: (error) => {
					console.error('Error en login:', error);
					this.loading = false;
					this.error = error.error?.message || 'Error al iniciar sesión';
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
