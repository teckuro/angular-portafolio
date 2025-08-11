import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Project } from '../models/project.model';
import { Work } from '../models/work.model';
import { ProjectsService } from '../services/projects.service';
import { WorksService } from '../services/works.service';

@Component({
	selector: 'app-portfolio-page',
	templateUrl: './portfolio-page.component.html',
	styleUrls: ['./portfolio-page.component.css']
})
export class PortfolioPageComponent implements OnInit {
	projects$: Observable<Project[]> = new Observable();
	works$: Observable<Work[]> = new Observable();
	constructor(
		private projectsService: ProjectsService,
		private worksService: WorksService
	) {
		// Constructor vacío intencional
	}

	ngOnInit(): void {
		this.loadProjects();
		this.loadWorks();
	}

	/**
	 * Carga los proyectos desde el servicio
	 */
	private loadProjects(): void {
		this.projects$ = this.projectsService.getProjects();
	}
	private loadWorks(): void {
		this.works$ = this.worksService.getWorks();
	}
}
