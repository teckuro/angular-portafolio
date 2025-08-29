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
					this.setCurrentUser(response.user, response.token);
				}),
				catchError((error) => {
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
			return false;
		}
	}

	/**
	 * Debuggear el estado completo de la autenticación
	 */
	debugAuthState(): void {
		// Método para debugging del estado de autenticación
	}

	/**
	 * Forzar navegación después del login exitoso
	 */
	forceNavigation(returnUrl: string): void {
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
		// Guardar en localStorage
		localStorage.setItem('admin_token', token);
		localStorage.setItem('admin_user', JSON.stringify(user));

		// Actualizar el estado inmediatamente
		this.currentUserSubject.next(user);
	}

	/**
	 * Limpiar datos del usuario actual
	 */
	public clearCurrentUser(): void {
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
			} catch (error) {
				this.clearCurrentUser();
			}
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

		// Intentar navegación normal primero
		this.router.navigate([targetUrl], { replaceUrl: true }).catch((error) => {
			// Fallback: usar window.location para forzar recarga
			window.location.href = targetUrl;
		});
	}
}
