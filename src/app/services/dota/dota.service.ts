import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class DotaService {
	constructor(private http: HttpClient) {}

	pruebaObtenerData(request: any): Observable<any> {
		const params = new HttpParams()
			.set('usuarioId', request.usuarioId)
			.set('fecha', request.fecha);

		return this.http.get<any>('https://api.opendota.com/api/heroStats');
	}

	obtenerInfoPersona(usuarioId: number) {
		const params = new HttpParams();
		params.append('usuarioId', usuarioId.toString());
		return this.http.get<any>(
			`https://api.opendota.com/api/players/${usuarioId}`,
			{ params }
		);
	}

	obtenerInfoRanking(usuarioId: number) {
		return this.http.get<any>(
			`https://api.opendota.com/api/players/${usuarioId}/totals`
		);
	}

	pruebaObtenerDataHeroes(request: any): Observable<any> {
		const params = new HttpParams()
			.set('usuarioId', request.usuarioId)
			.set('fecha', request.fecha);

		return this.http.get<any>('https://api.opendota.com/api/heroStats');
	}
}
