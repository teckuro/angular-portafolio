import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../../../../environments/environment';
import {
	AdminUser,
	AdminLoginRequest,
	AdminLoginResponse,
	AdminRegisterRequest
} from '../models/admin-user.model';

@Injectable({
	providedIn: 'root'
})
export class AdminAuthService {
	private readonly API_URL = `${environment.apiUrl}/admin`;
	private currentUserSubject = new BehaviorSubject<AdminUser | null>(null);
	public currentUser$ = this.currentUserSubject.asObservable();

	constructor(
		private http: HttpClient,
		private router: Router
	) {
		this.loadStoredUser();
	}

	/**
	 * Login de administrador
	 */
	login(credentials: AdminLoginRequest): Observable<AdminLoginResponse> {
		return this.http
			.post<AdminLoginResponse>(`${this.API_URL}/login`, credentials)
			.pipe(
				tap((response: AdminLoginResponse) => {
					console.log('Login exitoso:', response);
					this.setCurrentUser(response.user, response.token);
				}),
				catchError((error) => {
					console.error('Error en login service:', error);
					throw error;
				})
			);
	}

	/**
	 * Registro de administrador
	 */
	register(userData: AdminRegisterRequest): Observable<AdminLoginResponse> {
		return this.http
			.post<AdminLoginResponse>(`${this.API_URL}/register`, userData)
			.pipe(
				tap((response: AdminLoginResponse) => {
					this.setCurrentUser(response.user, response.token);
				})
			);
	}

	/**
	 * Logout de administrador
	 */
	logout(): Observable<any> {
		return this.http.post(`${this.API_URL}/logout`, {}).pipe(
			tap(() => {
				this.clearCurrentUser();
			}),
			catchError((error) => {
				console.error('Error en logout, limpiando estado local:', error);
				this.clearCurrentUser();
				return of({});
			})
		);
	}

	/**
	 * Obtener perfil del usuario actual
	 */
	getProfile(): Observable<AdminUser> {
		return this.http.get<AdminUser>(`${this.API_URL}/profile`).pipe(
			tap((user: AdminUser) => {
				this.currentUserSubject.next(user);
			}),
			catchError((error) => {
				console.error('Error obteniendo perfil:', error);
				// Si hay error al obtener perfil, limpiar estado
				this.clearCurrentUser();
				throw error;
			})
		);
	}

	/**
	 * Verificar si el usuario está autenticado
	 */
	isAuthenticated(): boolean {
		const token = this.getToken();
		const user = this.currentUserSubject.value;

		// Verificar que tanto el token como el usuario existan
		const isAuth = !!token && !!user;

		console.log('Verificando autenticación:', {
			token: !!token,
			user: !!user,
			isAuthenticated: isAuth
		});

		return isAuth;
	}

	/**
	 * Verificar si el token es válido (no expirado)
	 */
	isTokenValid(): boolean {
		const token = this.getToken();
		if (!token) return false;

		try {
			// Decodificar el token JWT para verificar si está expirado
			const payload = JSON.parse(atob(token.split('.')[1]));
			const currentTime = Date.now() / 1000;
			return payload.exp > currentTime;
		} catch (error) {
			console.error('Error verificando token:', error);
			return false;
		}
	}

	/**
	 * Debuggear el estado completo de la autenticación
	 */
	debugAuthState(): void {
		console.log('=== DEBUG AUTH STATE ===');
		console.log('Token en localStorage:', !!localStorage.getItem('admin_token'));
		console.log('Usuario en localStorage:', !!localStorage.getItem('admin_user'));
		console.log('Usuario actual en BehaviorSubject:', this.currentUserSubject.value);
		console.log('Token válido:', this.isTokenValid());
		console.log('Está autenticado:', this.isAuthenticated());
		console.log('========================');
	}

	/**
	 * Forzar navegación después del login exitoso
	 */
	forceNavigation(returnUrl: string): void {
		console.log('Forzando navegación a:', returnUrl);
		setTimeout(() => {
			window.location.href = returnUrl;
		}, 100);
	}

	/**
	 * Obtener token de autenticación
	 */
	getToken(): string | null {
		const token = localStorage.getItem('admin_token');
		return token;
	}

	/**
	 * Obtener usuario actual
	 */
	getCurrentUser(): AdminUser | null {
		return this.currentUserSubject.value;
	}

	/**
	 * Verificar si el usuario tiene rol específico
	 */
	hasRole(role: 'admin' | 'super_admin'): boolean {
		const user = this.getCurrentUser();
		return user?.role === role || user?.role === 'super_admin';
	}

	/**
	 * Establecer usuario actual y token
	 */
	private setCurrentUser(user: AdminUser, token: string): void {
		console.log('Estableciendo usuario:', user);
		console.log('Token:', token);

		// Guardar en localStorage
		localStorage.setItem('admin_token', token);
		localStorage.setItem('admin_user', JSON.stringify(user));

		// Actualizar el estado inmediatamente
		this.currentUserSubject.next(user);

		// Verificar que se haya guardado correctamente
		const storedToken = localStorage.getItem('admin_token');
		const storedUser = localStorage.getItem('admin_user');

		console.log('Estado actualizado:', {
			user: this.currentUserSubject.value,
			tokenStored: !!storedToken,
			userStored: !!storedUser,
			isAuthenticated: this.isAuthenticated()
		});
	}

	/**
	 * Limpiar datos del usuario actual
	 */
	public clearCurrentUser(): void {
		console.log('Limpiando datos del usuario');
		localStorage.removeItem('admin_token');
		localStorage.removeItem('admin_user');
		this.currentUserSubject.next(null);
	}

	/**
	 * Cargar usuario almacenado
	 */
	private loadStoredUser(): void {
		const storedUser = localStorage.getItem('admin_user');
		const storedToken = localStorage.getItem('admin_token');

		if (storedUser && storedToken) {
			try {
				const user = JSON.parse(storedUser);
				this.currentUserSubject.next(user);
				console.log('Usuario cargado desde localStorage:', user);
			} catch (error) {
				console.error('Error parsing stored user:', error);
				this.clearCurrentUser();
			}
		} else {
			console.log('No hay usuario almacenado o token faltante');
		}
	}

	/**
	 * Verificar token válido con el servidor
	 */
	validateToken(): Observable<boolean> {
		const token = this.getToken();
		if (!token) {
			return of(false);
		}

		return this.http.get<AdminUser>(`${this.API_URL}/profile`).pipe(
			tap((user: AdminUser) => {
				this.currentUserSubject.next(user);
			}),
			map(() => true),
			catchError(() => {
				this.clearCurrentUser();
				return of(false);
			})
		);
	}

	/**
	 * Navegar después del login exitoso
	 */
	navigateAfterLogin(returnUrl?: string): void {
		const targetUrl = returnUrl || '/admin/dashboard';
		console.log('Navegando después del login a:', targetUrl);

		// Intentar navegación normal primero
		this.router
			.navigate([targetUrl], { replaceUrl: true })
			.then(() => {
				console.log('Navegación exitosa a:', targetUrl);
			})
			.catch((error) => {
				console.error('Error en navegación, usando fallback:', error);
				// Fallback: usar window.location para forzar recarga
				window.location.href = targetUrl;
			});
	}
}
