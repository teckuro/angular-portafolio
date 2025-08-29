import { Component, OnInit, Input } from '@angular/core';
import { ThemeService, Theme } from '../../../core/services/theme.service';

@Component({
	selector: 'app-theme-toggle',
	templateUrl: './theme-toggle.component.html',
	styleUrls: ['./theme-toggle.component.css']
})
export class ThemeToggleComponent implements OnInit {
	currentTheme: Theme = 'dark';

	// Inputs para personalizar las clases CSS
	@Input() buttonClass: string = 'theme-toggle-btn';
	@Input() iconClass: string = 'theme-icon';
	@Input() containerClass: string = '';

	constructor(private themeService: ThemeService) {}

	ngOnInit(): void {
		this.themeService.currentTheme$.subscribe((theme) => {
			this.currentTheme = theme;
		});
	}

	toggleTheme(): void {
		this.themeService.toggleTheme();
	}
}
