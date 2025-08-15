import {
	ComponentFixture,
	TestBed,
	fakeAsync,
	tick
} from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { PortfolioPageComponent } from './portfolio-page.component';
import { ProjectsService } from '../services/projects.service';
import { WorksService } from '../services/works.service';
import { Project } from '../models/project.model';
import { Work } from '../models/work.model';

describe('PortfolioPageComponent', () => {
	let component: PortfolioPageComponent;
	let fixture: ComponentFixture<PortfolioPageComponent>;
	let projectsService: jasmine.SpyObj<ProjectsService>;
	let worksService: jasmine.SpyObj<WorksService>;

	const mockProjects: Project[] = [
		{
			id: 1,
			title: 'Test Project',
			description: 'Test Description',
			date: '2024',
			tech: ['Angular', 'TypeScript'],
			image: '🛒',
			demoLink: 'https://demo.com',
			codeLink: 'https://github.com'
		}
	];

	const mockWorks: Work[] = [
		{
			id: 1,
			company: 'Test Company',
			position: 'Developer',
			description: 'Test work description',
			startDate: '2021',
			endDate: '2023',
			location: 'Test Location',
			tech: ['PHP', 'Laravel'],
			achievements: ['Achievement 1', 'Achievement 2'],
			isCurrent: false,
			companyUrl: 'https://test.com'
		}
	];

	beforeEach(async () => {
		const projectsSpy = jasmine.createSpyObj('ProjectsService', [
			'getProjects'
		]);
		const worksSpy = jasmine.createSpyObj('WorksService', ['getWorks']);

		projectsSpy.getProjects.and.returnValue(of(mockProjects));
		worksSpy.getWorks.and.returnValue(of(mockWorks));

		await TestBed.configureTestingModule({
			imports: [RouterTestingModule],
			declarations: [PortfolioPageComponent],
			providers: [
				{ provide: ProjectsService, useValue: projectsSpy },
				{ provide: WorksService, useValue: worksSpy }
			]
		}).compileComponents();

		projectsService = TestBed.inject(
			ProjectsService
		) as jasmine.SpyObj<ProjectsService>;
		worksService = TestBed.inject(WorksService) as jasmine.SpyObj<WorksService>;
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(PortfolioPageComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should load projects and works on init', () => {
		expect(projectsService.getProjects).toHaveBeenCalled();
		expect(worksService.getWorks).toHaveBeenCalled();
	});

	it('should initialize with default values', () => {
		expect(component.activeSection).toBe('about');
		expect(component.showCurriculumModal).toBe(false);
		expect(component.headerVisible).toBe(false);
	});

	it('should set header visible after delay', fakeAsync(() => {
		component.ngOnInit();
		tick(300);
		expect(component.headerVisible).toBe(true);
	}));

	it('should scroll to section when scrollToSection is called', () => {
		spyOn(document, 'getElementById').and.returnValue({
			scrollIntoView: jasmine.createSpy('scrollIntoView')
		} as any);

		component.scrollToSection('about');

		expect(document.getElementById).toHaveBeenCalledWith('about');
	});

	it('should update active section after scroll', fakeAsync(() => {
		component.scrollToSection('work');
		tick(100);
		expect(component.activeSection).toBe('work');
	}));

	it('should open curriculum modal', () => {
		spyOn(document.body.style, 'setProperty');

		component.openCurriculumModal();

		expect(component.showCurriculumModal).toBe(true);
		expect(document.body.style.setProperty).toHaveBeenCalledWith(
			'overflow',
			'hidden'
		);
	});

	it('should close curriculum modal', fakeAsync(() => {
		component.showCurriculumModal = true;
		spyOn(document.body.style, 'setProperty');

		component.closeCurriculumModal();
		tick(300);

		expect(component.showCurriculumModal).toBe(false);
		expect(document.body.style.setProperty).toHaveBeenCalledWith(
			'overflow',
			'auto'
		);
	}));

	it('should download PDF when downloadPDF is called', () => {
		spyOn(document, 'createElement').and.returnValue({
			href: '',
			download: '',
			target: '',
			click: jasmine.createSpy('click')
		} as any);
		spyOn(document.body, 'appendChild');
		spyOn(document.body, 'removeChild');

		component.downloadPDF();

		expect(document.createElement).toHaveBeenCalledWith('a');
		expect(document.body.appendChild).toHaveBeenCalled();
		expect(document.body.removeChild).toHaveBeenCalled();
	});

	it('should return correct animation classes', () => {
		component.sectionsVisible['about'] = true;
		component.sectionsVisible['work'] = false;

		expect(component.getAnimationClasses('about')).toContain('animate-in');
		expect(component.getAnimationClasses('work')).not.toContain('animate-in');
	});

	it('should handle scroll events', () => {
		spyOn(component as any, 'updateActiveSection');
		spyOn(component as any, 'handleScrollAnimations');

		component.onScroll();

		expect(component['updateActiveSection']).toHaveBeenCalled();
		expect(component['handleScrollAnimations']).toHaveBeenCalled();
	});

	it('should initialize animations after view init', () => {
		spyOn(component as any, 'initializeAnimations');

		component.ngAfterViewInit();

		expect(component['initializeAnimations']).toHaveBeenCalled();
	});

	it('should handle intersection observer for animations', () => {
		// Mock IntersectionObserver
		const mockObserver = {
			observe: jasmine.createSpy('observe')
		};

		spyOn(window, 'IntersectionObserver').and.returnValue(mockObserver as any);

		component['initializeAnimations']();

		expect(window.IntersectionObserver).toHaveBeenCalled();
	});

	it('should handle parallax effect on scroll', () => {
		const mockHeader = {
			style: {
				transform: ''
			}
		};

		spyOn(
			component['elementRef'].nativeElement,
			'querySelector'
		).and.returnValue(mockHeader);

		component['handleScrollAnimations']();

		expect(
			component['elementRef'].nativeElement.querySelector
		).toHaveBeenCalledWith('header');
	});

	it('should update active section based on scroll position', () => {
		const mockElement = {
			offsetTop: 100,
			offsetHeight: 200
		};

		spyOn(document, 'getElementById').and.returnValue(mockElement as any);
		spyOn(window, 'scrollY').and.returnValue(150);

		component['updateActiveSection']();

		expect(document.getElementById).toHaveBeenCalled();
	});

	it('should handle modal animation triggers', fakeAsync(() => {
		const mockModal = {
			classList: {
				add: jasmine.createSpy('add')
			}
		};

		spyOn(document, 'querySelector').and.returnValue(mockModal as any);

		component.openCurriculumModal();
		tick(10);

		expect(document.querySelector).toHaveBeenCalledWith('.modal-content');
		expect(mockModal.classList.add).toHaveBeenCalledWith('modal-visible');
	}));
});
