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
		component: AdminProjectsListComponent
	},
	{
		path: 'new',
		component: AdminProjectFormComponent
	},
	{
		path: 'edit/:id',
		component: AdminProjectFormComponent
	}
];

// Componentes temporales
@Component({
	selector: 'app-admin-projects-list',
	template: '<div>Lista de Proyectos - En desarrollo</div>'
})
export class AdminProjectsListComponent {}

@Component({
	selector: 'app-admin-project-form',
	template: '<div>Formulario de Proyecto - En desarrollo</div>'
})
export class AdminProjectFormComponent {}

@NgModule({
	declarations: [AdminProjectsListComponent, AdminProjectFormComponent],
	imports: [CommonModule, RouterModule.forChild(routes)]
})
export class AdminProjectsModule {}
