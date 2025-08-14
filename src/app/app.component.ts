import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
	title = 'angular-portafolio';

	constructor() {
		// Componente inicializado
	}

	ngOnInit(): void {
		// Componente inicializado correctamente
		console.log('Portfolio Angular inicializado');
	}
}
