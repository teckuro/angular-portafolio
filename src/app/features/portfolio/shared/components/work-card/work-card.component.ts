import { Component, Input } from '@angular/core';
import { Work } from '../../models/work.model';

@Component({
	selector: 'app-work-card',
	templateUrl: './work-card.component.html',
	styleUrls: ['./work-card.component.css']
})
export class WorkCardComponent {
	@Input() work!: Work;

	constructor() {
		// Constructor vacío intencional
	}

	formatDate(dateString: string): string {
		const date = new Date(dateString);
		const options: Intl.DateTimeFormatOptions = {
			year: 'numeric',
			month: 'short'
		};
		return date.toLocaleDateString('es-ES', options);
	}

	getYear(dateString: string): number {
		const date = new Date(dateString);
		return date.getFullYear();
	}

	getDuration(startDate: string, endDate?: string): string {
		const start = new Date(startDate);
		const end = endDate ? new Date(endDate) : new Date();

		const years = end.getFullYear() - start.getFullYear();
		const months = end.getMonth() - start.getMonth();

		let duration = '';

		if (years > 0) {
			duration += `${years} año${years > 1 ? 's' : ''}`;
			if (months > 0) {
				duration += ` ${months} mes${months > 1 ? 'es' : ''}`;
			}
		} else if (months > 0) {
			duration += `${months} mes${months > 1 ? 'es' : ''}`;
		} else {
			duration = 'Menos de 1 mes';
		}

		return duration;
	}
}
