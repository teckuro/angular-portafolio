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
}
