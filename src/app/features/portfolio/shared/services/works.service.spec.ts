import { TestBed } from '@angular/core/testing';
import { WorksService } from './works.service';
import { Work } from '../models/work.model';

describe('WorksService', () => {
	let service: WorksService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(WorksService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	it('should return all works', (done) => {
		service.getWorks().subscribe((works) => {
			expect(works).toBeDefined();
			expect(works.length).toBeGreaterThan(0);
			expect(works[0]).toHaveProperty('id');
			expect(works[0]).toHaveProperty('company');
			expect(works[0]).toHaveProperty('position');
			done();
		});
	});

	it('should return work by id', (done) => {
		service.getWorkById(1).subscribe((work) => {
			expect(work).toBeDefined();
			expect(work?.id).toBe(1);
			done();
		});
	});

	it('should return undefined for non-existent work id', (done) => {
		service.getWorkById(999).subscribe((work) => {
			expect(work).toBeUndefined();
			done();
		});
	});

	it('should return current works only', (done) => {
		service.getCurrentWorks().subscribe((works) => {
			expect(works).toBeDefined();
			works.forEach((work) => {
				expect(work.isCurrent).toBe(true);
			});
			done();
		});
	});

	it('should filter works by technology', (done) => {
		service.getWorksByTech('PHP').subscribe((works) => {
			expect(works).toBeDefined();
			expect(works.length).toBeGreaterThan(0);
			works.forEach((work) => {
				expect(
					work.tech.some((tech) => tech.toLowerCase().includes('php'))
				).toBe(true);
			});
			done();
		});
	});

	it('should return empty array for non-existent technology', (done) => {
		service.getWorksByTech('NonExistentTech').subscribe((works) => {
			expect(works).toBeDefined();
			expect(works.length).toBe(0);
			done();
		});
	});

	it('should filter works by company', (done) => {
		service.getWorksByCompany('DESIS').subscribe((works) => {
			expect(works).toBeDefined();
			expect(works.length).toBeGreaterThan(0);
			works.forEach((work) => {
				expect(work.company.toLowerCase()).toContain('desis');
			});
			done();
		});
	});

	it('should return empty array for non-existent company', (done) => {
		service.getWorksByCompany('NonExistentCompany').subscribe((works) => {
			expect(works).toBeDefined();
			expect(works.length).toBe(0);
			done();
		});
	});

	it('should add new work', (done) => {
		const newWork: Omit<Work, 'id'> = {
			company: 'Test Company',
			position: 'Test Position',
			description: 'Test Description',
			startDate: '2024',
			endDate: '2024',
			location: 'Test Location',
			tech: ['Test Tech'],
			achievements: ['Test Achievement'],
			isCurrent: false,
			companyUrl: 'https://test.com'
		};

		service.addWork(newWork).subscribe((work) => {
			expect(work).toBeDefined();
			expect(work.company).toBe('Test Company');
			expect(work.id).toBeDefined();
			expect(work.id).toBeGreaterThan(0);
			done();
		});
	});

	it('should generate unique id for new work', (done) => {
		const work1: Omit<Work, 'id'> = {
			company: 'Company 1',
			position: 'Position 1',
			description: 'Description 1',
			startDate: '2024',
			endDate: '2024',
			location: 'Location 1',
			tech: ['Tech 1'],
			achievements: ['Achievement 1'],
			isCurrent: false
		};

		const work2: Omit<Work, 'id'> = {
			company: 'Company 2',
			position: 'Position 2',
			description: 'Description 2',
			startDate: '2024',
			endDate: '2024',
			location: 'Location 2',
			tech: ['Tech 2'],
			achievements: ['Achievement 2'],
			isCurrent: false
		};

		service.addWork(work1).subscribe((firstWork) => {
			service.addWork(work2).subscribe((secondWork) => {
				expect(firstWork.id).not.toBe(secondWork.id);
				expect(secondWork.id).toBe(firstWork.id + 1);
				done();
			});
		});
	});

	it('should update existing work', (done) => {
		const updateData = {
			position: 'Updated Position',
			description: 'Updated Description'
		};

		service.updateWork(1, updateData).subscribe((updatedWork) => {
			expect(updatedWork).toBeDefined();
			expect(updatedWork?.position).toBe('Updated Position');
			expect(updatedWork?.description).toBe('Updated Description');
			expect(updatedWork?.id).toBe(1);
			done();
		});
	});

	it('should return undefined when updating non-existent work', (done) => {
		const updateData = {
			position: 'Updated Position'
		};

		service.updateWork(999, updateData).subscribe((updatedWork) => {
			expect(updatedWork).toBeUndefined();
			done();
		});
	});

	it('should delete existing work', (done) => {
		service.deleteWork(1).subscribe((success) => {
			expect(success).toBe(true);
			done();
		});
	});

	it('should return false when deleting non-existent work', (done) => {
		service.deleteWork(999).subscribe((success) => {
			expect(success).toBe(false);
			done();
		});
	});

	it('should handle case-insensitive technology search', (done) => {
		service.getWorksByTech('php').subscribe((works) => {
			expect(works).toBeDefined();
			expect(works.length).toBeGreaterThan(0);
			works.forEach((work) => {
				expect(
					work.tech.some((tech) => tech.toLowerCase().includes('php'))
				).toBe(true);
			});
			done();
		});
	});

	it('should handle case-insensitive company search', (done) => {
		service.getWorksByCompany('desis').subscribe((works) => {
			expect(works).toBeDefined();
			expect(works.length).toBeGreaterThan(0);
			works.forEach((work) => {
				expect(work.company.toLowerCase()).toContain('desis');
			});
			done();
		});
	});

	it('should maintain work structure when adding new work', (done) => {
		const newWork: Omit<Work, 'id'> = {
			company: 'Structured Company',
			position: 'Structured Position',
			description: 'A well-structured work experience',
			startDate: '2024',
			endDate: '2024',
			location: 'Structured Location',
			tech: ['TypeScript', 'Angular'],
			achievements: ['Achievement 1', 'Achievement 2'],
			isCurrent: false,
			companyUrl: 'https://structured.com'
		};

		service.addWork(newWork).subscribe((work) => {
			expect(work.company).toBe(newWork.company);
			expect(work.position).toBe(newWork.position);
			expect(work.description).toBe(newWork.description);
			expect(work.startDate).toBe(newWork.startDate);
			expect(work.endDate).toBe(newWork.endDate);
			expect(work.location).toBe(newWork.location);
			expect(work.tech).toEqual(newWork.tech);
			expect(work.achievements).toEqual(newWork.achievements);
			expect(work.isCurrent).toBe(newWork.isCurrent);
			expect(work.companyUrl).toBe(newWork.companyUrl);
			expect(work.id).toBeDefined();
			done();
		});
	});

	it('should handle current work without end date', (done) => {
		const currentWork: Omit<Work, 'id'> = {
			company: 'Current Company',
			position: 'Current Position',
			description: 'Current work experience',
			startDate: '2024',
			location: 'Current Location',
			tech: ['Current Tech'],
			achievements: ['Current Achievement'],
			isCurrent: true
		};

		service.addWork(currentWork).subscribe((work) => {
			expect(work.isCurrent).toBe(true);
			expect(work.endDate).toBeUndefined();
			done();
		});
	});
});
