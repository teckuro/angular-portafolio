import { Component, Input } from '@angular/core';

export interface StatItem {
	label: string;
	value: number | string;
	icon?: string;
	color?: string;
}

@Component({
	selector: 'app-admin-stats-card',
	templateUrl: './admin-stats-card.component.html',
	styleUrls: ['./admin-stats-card.component.css']
})
export class AdminStatsCardComponent {
	@Input() title = '';
	@Input() icon = '';
	@Input() stats: StatItem[] = [];
	@Input() actionText = '';
	@Input() actionLink = '';
	@Input() loading = false;
	@Input() theme: 'primary' | 'success' | 'warning' | 'danger' | 'info' =
		'primary';

	getThemeClass(): string {
		return `theme-${this.theme}`;
	}

	getIconColor(): string {
		const colors = {
			primary: '#667eea',
			success: '#28a745',
			warning: '#ffc107',
			danger: '#dc3545',
			info: '#17a2b8'
		};
		return colors[this.theme] || colors.primary;
	}
}
