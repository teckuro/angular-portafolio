import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BaseApiService } from '../../../../core/services/base-api.service';
import { Work } from '../models/work.model';

@Injectable({
	providedIn: 'root'
})
export class WorksService extends BaseApiService<Work> {
	protected readonly endpoint = 'works';

	constructor(http: HttpClient) {
		super(http);
	}

	/**
	 * Transforma los datos específicos de Work
	 */
	protected transformData(work: any): Work {
		// Alinear nombre de campo del backend ("technologies") con el modelo ("tech")
		if ('technologies' in work && !('tech' in work)) {
			work.tech = work.technologies;
			delete work.technologies;
		}

		// Transformar campos JSON a arrays de forma segura
		this.transformJsonField(work, 'tech');
		this.transformJsonField(work, 'achievements');

		return work as Work;
	}

	/**
	 * Obtiene trabajos activos
	 */
	getActiveWorks(): Observable<Work[]> {
		return this.getByStatus('active');
	}

	/**
	 * Obtiene el trabajo actual
	 */
	getCurrentWork(): Observable<Work | null> {
		return this.http
			.get<{ success: boolean; data: Work[] }>(`${this.apiUrl}/current`)
			.pipe(
				map((response) =>
					response.data.length > 0 ? this.transformData(response.data[0]) : null
				)
			);
	}

	/**
	 * Obtiene trabajos por empresa
	 */
	getWorksByCompany(company: string): Observable<Work[]> {
		return this.http
			.get<{
				success: boolean;
				data: Work[];
			}>(`${this.apiUrl}?company=${encodeURIComponent(company)}`)
			.pipe(
				map((response) => response.data.map((item) => this.transformData(item)))
			);
	}

	/**
	 * Obtiene trabajos por tecnología
	 */
	getWorksByTech(tech: string): Observable<Work[]> {
		return this.http
			.get<{
				success: boolean;
				data: Work[];
			}>(`${this.apiUrl}?tech=${encodeURIComponent(tech)}`)
			.pipe(
				map((response) => response.data.map((item) => this.transformData(item)))
			);
	}
}
