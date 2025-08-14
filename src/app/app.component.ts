import { Component, OnInit } from '@angular/core';
import { inject } from '@vercel/analytics';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
	title = 'angular-portafolio';

	constructor() {
		// Inicializar Vercel Analytics
		inject();
	}

	ngOnInit(): void {
		// Componente inicializado correctamente
		console.log('Portfolio Angular inicializado');
	}
}
