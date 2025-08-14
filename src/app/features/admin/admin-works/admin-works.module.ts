import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { Component } from '@angular/core';

const routes: Routes = [
	{
		path: '',
		redirectTo: 'list',
		pathMatch: 'full'
	},
	{
		path: 'list',
		component: AdminWorksListComponent
	},
	{
		path: 'new',
		component: AdminWorkFormComponent
	},
	{
		path: 'edit/:id',
		component: AdminWorkFormComponent
	}
];

// Componentes temporales
@Component({
	selector: 'app-admin-works-list',
	template: '<div>Lista de Experiencia Laboral - En desarrollo</div>'
})
export class AdminWorksListComponent {}

@Component({
	selector: 'app-admin-work-form',
	template: '<div>Formulario de Experiencia Laboral - En desarrollo</div>'
})
export class AdminWorkFormComponent {}

@NgModule({
	declarations: [
		AdminWorksListComponent,
		AdminWorkFormComponent
	],
	imports: [
		CommonModule,
		RouterModule.forChild(routes)
	]
})
export class AdminWorksModule {}
