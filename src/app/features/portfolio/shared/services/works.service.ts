import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';
import { Work } from '../models/work.model';

@Injectable({
	providedIn: 'root'
})
export class WorksService {
	private readonly API_URL = `${environment.apiUrl}/works`;

	constructor(private http: HttpClient) {}

	getWorks(): Observable<Work[]> {
		return this.http
			.get<{ success: boolean; data: Work[] }>(this.API_URL)
			.pipe(map((response) => response.data));
	}

	getWorkById(id: number): Observable<Work> {
		return this.http
			.get<{ success: boolean; data: Work }>(`${this.API_URL}/${id}`)
			.pipe(map((response) => response.data));
	}

	getActiveWorks(): Observable<Work[]> {
		return this.http
			.get<{ success: boolean; data: Work[] }>(`${this.API_URL}?status=active`)
			.pipe(map((response) => response.data));
	}

	getCurrentWork(): Observable<Work | null> {
		return this.http
			.get<{ success: boolean; data: Work[] }>(`${this.API_URL}/current`)
			.pipe(
				map((response) => (response.data.length > 0 ? response.data[0] : null))
			);
	}

	getWorksByCompany(company: string): Observable<Work[]> {
		return this.http
			.get<{
				success: boolean;
				data: Work[];
			}>(`${this.API_URL}?company=${encodeURIComponent(company)}`)
			.pipe(map((response) => response.data));
	}

	getWorksByTech(tech: string): Observable<Work[]> {
		return this.http
			.get<{
				success: boolean;
				data: Work[];
			}>(`${this.API_URL}?tech=${encodeURIComponent(tech)}`)
			.pipe(map((response) => response.data));
	}
}
