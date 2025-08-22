import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';
import { Project } from '../models/project.model';

// Función para transformar strings JSON a arrays
function transformProjectData(project: any): Project {
	if (typeof project.technologies === 'string') {
		try {
			project.technologies = JSON.parse(project.technologies);
		} catch (e) {
			project.technologies = [];
		}
	}
	
	if (typeof project.achievements === 'string') {
		try {
			project.achievements = JSON.parse(project.achievements);
		} catch (e) {
			project.achievements = [];
		}
	}
	
	if (typeof project.responsibilities === 'string') {
		try {
			project.responsibilities = JSON.parse(project.responsibilities);
		} catch (e) {
			project.responsibilities = [];
		}
	}
	
	return project;
}

@Injectable({
	providedIn: 'root'
})
export class ProjectsService {
	private readonly API_URL = `${environment.apiUrl}/projects`;

	constructor(private http: HttpClient) {}

	getProjects(): Observable<Project[]> {
		return this.http
			.get<{ success: boolean; data: Project[] }>(this.API_URL)
			.pipe(map((response) => response.data.map(transformProjectData)));
	}

	getProjectById(id: number): Observable<Project> {
		return this.http
			.get<{ success: boolean; data: Project }>(`${this.API_URL}/${id}`)
			.pipe(map((response) => transformProjectData(response.data)));
	}

	getFeaturedProjects(): Observable<Project[]> {
		return this.http
			.get<{ success: boolean; data: Project[] }>(`${this.API_URL}/featured`)
			.pipe(map((response) => response.data.map(transformProjectData)));
	}

	getActiveProjects(): Observable<Project[]> {
		return this.http
			.get<{
				success: boolean;
				data: Project[];
			}>(`${this.API_URL}?status=active`)
			.pipe(map((response) => response.data.map(transformProjectData)));
	}

	getProjectsByTech(tech: string): Observable<Project[]> {
		return this.http
			.get<{
				success: boolean;
				data: Project[];
			}>(`${this.API_URL}?tech=${encodeURIComponent(tech)}`)
			.pipe(map((response) => response.data.map(transformProjectData)));
	}

	getProjectsByStatus(status: string): Observable<Project[]> {
		return this.http
			.get<{
				success: boolean;
				data: Project[];
			}>(`${this.API_URL}?status=${status}`)
			.pipe(map((response) => response.data.map(transformProjectData)));
	}
}
