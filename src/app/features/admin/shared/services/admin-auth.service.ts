import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
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

	constructor(private http: HttpClient) {
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
			})
		);
	}

	/**
	 * Verificar si el usuario está autenticado
	 */
	isAuthenticated(): boolean {
		const token = this.getToken();
		const user = this.currentUserSubject.value;
		console.log('Verificando autenticación:', { token: !!token, user: !!user });
		return !!token && !!user;
	}

	/**
	 * Obtener token de autenticación
	 */
	getToken(): string | null {
		return localStorage.getItem('admin_token');
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
		localStorage.setItem('admin_token', token);
		localStorage.setItem('admin_user', JSON.stringify(user));

		// Asegurar que el estado se actualice de forma asíncrona
		setTimeout(() => {
			this.currentUserSubject.next(user);
		}, 0);
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
		if (storedUser) {
			try {
				const user = JSON.parse(storedUser);
				this.currentUserSubject.next(user);
			} catch (error) {
				console.error('Error parsing stored user:', error);
				this.clearCurrentUser();
			}
		}
	}
}
