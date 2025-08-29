import { Component, OnInit } from '@angular/core';
import { ThemeService } from './core/services/theme.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
	title = 'angular-portafolio';

	constructor(private themeService: ThemeService) {
		// Inicializar el tema al cargar la aplicación
	}

	ngOnInit(): void {
		// Componente inicializado correctamente
		console.log('Portfolio Angular inicializado');
	}
}
