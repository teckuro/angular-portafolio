import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
	providedIn: 'root'
})
export abstract class BaseApiService<T> {
	protected abstract readonly endpoint: string;

	constructor(protected http: HttpClient) {}

	protected get apiUrl(): string {
		return `${environment.apiUrl}/${this.endpoint}`;
	}

	/**
	 * Transforma strings JSON a arrays de manera segura
	 */
	protected transformJsonField(data: any, fieldName: string): void {
		if (typeof data[fieldName] === 'string') {
			try {
				const parsed = JSON.parse(data[fieldName]);
				data[fieldName] = Array.isArray(parsed) ? parsed : [];
			} catch (e) {
				console.warn(`Error parsing ${fieldName}:`, e);
				data[fieldName] = [];
			}
		} else if (!Array.isArray(data[fieldName])) {
			// Si no es string ni array, asegurar que sea array
			data[fieldName] = [];
		}
	}

	/**
	 * Obtiene todos los elementos
	 */
	getAll(): Observable<T[]> {
		return this.http
			.get<{ success: boolean; data: T[] }>(this.apiUrl)
			.pipe(map((response) => response.data.map((item) => this.transformData(item))));
	}

	/**
	 * Obtiene un elemento por ID
	 */
	getById(id: number): Observable<T> {
		return this.http
			.get<{ success: boolean; data: T }>(`${this.apiUrl}/${id}`)
			.pipe(map((response) => this.transformData(response.data)));
	}

	/**
	 * Obtiene elementos con filtro de estado
	 */
	getByStatus(status: string): Observable<T[]> {
		return this.http
			.get<{ success: boolean; data: T[] }>(`${this.apiUrl}?status=${status}`)
			.pipe(map((response) => response.data.map((item) => this.transformData(item))));
	}

	/**
	 * Método abstracto para transformar datos específicos de cada servicio
	 */
	protected abstract transformData(data: any): T;
}
