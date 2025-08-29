import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
	// Redirige la ruta vacía al módulo portfolio
	{ path: '', redirectTo: 'index', pathMatch: 'full' },

	// Lazy loading del módulo portfolio
	{
		path: 'index',
		loadChildren: () =>
			import('./features/portfolio/portfolio.module').then(
				(m) => m.PortfolioModule
			)
	},

	// Lazy loading del módulo admin
	{
		path: 'admin',
		loadChildren: () =>
			import('./features/admin/admin.module').then((m) => m.AdminModule)
	},

	// Ruta fallback si la URL no coincide con ninguna ruta
	{ path: '**', redirectTo: 'index' }
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule {}
