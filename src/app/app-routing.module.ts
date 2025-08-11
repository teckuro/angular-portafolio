import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
	// Redirige la ruta vacía al módulo portfolio
	{ path: '', redirectTo: 'portfolio', pathMatch: 'full' },

	// Lazy loading del módulo portfolio
	{
		path: 'portfolio',
		loadChildren: () =>
			import('./features/portfolio/portfolio.module').then(
				(m) => m.PortfolioModule
			)
	},

	// Ruta fallback si la URL no coincide con ninguna ruta
	{ path: '**', redirectTo: 'portfolio' }
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule {}
