import { Component, OnInit } from '@angular/core';
import { DotaService } from 'src/app/services/dota/dota.service';

@Component({
	selector: 'app-inicio',
	templateUrl: './inicio.component.html',
	styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {
	usuarioKuroko = 96704850;
	usuarioFugaze = 107362562;
	usuarioJaque = 133158617;
	datos: any[] = [];
	int: any;
	res = '';

	constructor(private dotaService: DotaService) {}

	ngOnInit(): void {
		// this.cargaInicial();
		this.obtenerUsuario();
		this.obtenerInfoRanking();
		this.obtenerHeroes();
		void this.obtenerInfoPersona();
	}

	cargaInicial() {
		debugger;
		this.dotaService.pruebaObtenerData(this.usuarioKuroko).subscribe({
			next: (res) => (this.datos = res),
			error: (err) => console.error(err)
		});
	}

	obtenerUsuario() {
		const respuesta = this.dotaService
			.obtenerInfoPersona(this.usuarioJaque)
			.toPromise();
	}
	obtenerInfoRanking() {
		const respuesta = this.dotaService
			.obtenerInfoRanking(this.usuarioJaque)
			.toPromise();
	}
	// metodo topromise
	obtenerInfoPersona(): void {
		const res = this.dotaService
			.obtenerInfoPersona(this.usuarioFugaze)
			.toPromise()
			.then((res) => {
				console.log(`Respuesta: ${JSON.stringify(res, null, 2)}`);
			})
			.catch((error) => {
				console.log('Error en la promesa:', error);
			});
		// .then((res) => console.log(`Respuesta: ${JSON.stringify(res, null, 2)}`)) // trae todos los datos del usuario
		// console.log('Información del usuario:', res);
	}
	obtenerHeroes() {
		this.dotaService.pruebaObtenerDataHeroes(this.usuarioKuroko).subscribe({
			next: (res) => (this.datos = res),
			error: (err) => console.error(err)
		});
	}
}
