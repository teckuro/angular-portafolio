import { TestBed } from '@angular/core/testing';
import { ProjectsService } from './projects.service';
import { Project } from '../models/project.model';

describe('ProjectsService', () => {
	let service: ProjectsService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(ProjectsService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	it('should return all projects', (done) => {
		service.getProjects().subscribe((projects) => {
			expect(projects).toBeDefined();
			expect(projects.length).toBeGreaterThan(0);
			expect(projects[0]).toHaveProperty('id');
			expect(projects[0]).toHaveProperty('title');
			expect(projects[0]).toHaveProperty('description');
			done();
		});
	});

	it('should return project by id', (done) => {
		service.getProjectById(1).subscribe((project) => {
			expect(project).toBeDefined();
			expect(project?.id).toBe(1);
			done();
		});
	});

	it('should return undefined for non-existent project id', (done) => {
		service.getProjectById(999).subscribe((project) => {
			expect(project).toBeUndefined();
			done();
		});
	});

	it('should filter projects by technology', (done) => {
		service.getProjectsByTech('Angular').subscribe((projects) => {
			expect(projects).toBeDefined();
			expect(projects.length).toBeGreaterThan(0);
			projects.forEach((project) => {
				expect(
					project.tech.some((tech) => tech.toLowerCase().includes('angular'))
				).toBe(true);
			});
			done();
		});
	});

	it('should return empty array for non-existent technology', (done) => {
		service.getProjectsByTech('NonExistentTech').subscribe((projects) => {
			expect(projects).toBeDefined();
			expect(projects.length).toBe(0);
			done();
		});
	});

	it('should add new project', (done) => {
		const newProject: Omit<Project, 'id'> = {
			title: 'Test Project',
			description: 'Test Description',
			date: '2024',
			tech: ['Test Tech'],
			image: '🧪',
			demoLink: 'https://test.com',
			codeLink: 'https://github.com/test'
		};

		service.addProject(newProject).subscribe((project) => {
			expect(project).toBeDefined();
			expect(project.title).toBe('Test Project');
			expect(project.id).toBeDefined();
			expect(project.id).toBeGreaterThan(0);
			done();
		});
	});

	it('should generate unique id for new project', (done) => {
		const project1: Omit<Project, 'id'> = {
			title: 'Project 1',
			description: 'Description 1',
			date: '2024',
			tech: ['Tech 1'],
			image: '1️⃣'
		};

		const project2: Omit<Project, 'id'> = {
			title: 'Project 2',
			description: 'Description 2',
			date: '2024',
			tech: ['Tech 2'],
			image: '2️⃣'
		};

		service.addProject(project1).subscribe((firstProject) => {
			service.addProject(project2).subscribe((secondProject) => {
				expect(firstProject.id).not.toBe(secondProject.id);
				expect(secondProject.id).toBe(firstProject.id + 1);
				done();
			});
		});
	});

	it('should handle case-insensitive technology search', (done) => {
		service.getProjectsByTech('angular').subscribe((projects) => {
			expect(projects).toBeDefined();
			expect(projects.length).toBeGreaterThan(0);
			projects.forEach((project) => {
				expect(
					project.tech.some((tech) => tech.toLowerCase().includes('angular'))
				).toBe(true);
			});
			done();
		});
	});

	it('should maintain project structure when adding new project', (done) => {
		const newProject: Omit<Project, 'id'> = {
			title: 'Structured Project',
			description: 'A well-structured project',
			date: '2024',
			tech: ['TypeScript', 'Angular'],
			image: '🏗️',
			demoLink: 'https://demo.com',
			codeLink: 'https://github.com/code'
		};

		service.addProject(newProject).subscribe((project) => {
			expect(project.title).toBe(newProject.title);
			expect(project.description).toBe(newProject.description);
			expect(project.date).toBe(newProject.date);
			expect(project.tech).toEqual(newProject.tech);
			expect(project.image).toBe(newProject.image);
			expect(project.demoLink).toBe(newProject.demoLink);
			expect(project.codeLink).toBe(newProject.codeLink);
			expect(project.id).toBeDefined();
			done();
		});
	});
});
