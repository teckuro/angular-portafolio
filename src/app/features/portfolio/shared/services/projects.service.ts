import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';
import { Project } from '../models/project.model';

@Injectable({
	providedIn: 'root'
})
export class ProjectsService {
	private readonly API_URL = `${environment.apiUrl}/projects`;

	constructor(private http: HttpClient) {}

	getProjects(): Observable<Project[]> {
		return this.http
			.get<{ success: boolean; data: Project[] }>(this.API_URL)
			.pipe(map((response) => response.data));
	}

	getProjectById(id: number): Observable<Project> {
		return this.http
			.get<{ success: boolean; data: Project }>(`${this.API_URL}/${id}`)
			.pipe(map((response) => response.data));
	}

	getFeaturedProjects(): Observable<Project[]> {
		return this.http
			.get<{ success: boolean; data: Project[] }>(`${this.API_URL}/featured`)
			.pipe(map((response) => response.data));
	}

	getActiveProjects(): Observable<Project[]> {
		return this.http
			.get<{
				success: boolean;
				data: Project[];
			}>(`${this.API_URL}?status=active`)
			.pipe(map((response) => response.data));
	}

	getProjectsByTech(tech: string): Observable<Project[]> {
		return this.http
			.get<{
				success: boolean;
				data: Project[];
			}>(`${this.API_URL}?tech=${encodeURIComponent(tech)}`)
			.pipe(map((response) => response.data));
	}

	getProjectsByStatus(status: string): Observable<Project[]> {
		return this.http
			.get<{
				success: boolean;
				data: Project[];
			}>(`${this.API_URL}?status=${status}`)
			.pipe(map((response) => response.data));
	}
}
