import { Component, OnInit } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
	title = 'angular-portafolio';

	constructor(private swUpdate: SwUpdate) {}

	ngOnInit(): void {
		this.checkForUpdates();
	}

	/**
	 * Verifica actualizaciones de la PWA
	 */
	private checkForUpdates(): void {
		if (this.swUpdate.isEnabled) {
			this.swUpdate.versionUpdates.subscribe(event => {
				if (event.type === 'VERSION_READY') {
					if (confirm('Hay una nueva versión disponible. ¿Deseas actualizar?')) {
						window.location.reload();
					}
				}
			});
		}
	}
}
