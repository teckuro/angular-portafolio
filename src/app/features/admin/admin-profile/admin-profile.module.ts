import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { Component } from '@angular/core';

const routes: Routes = [
	{
		path: '',
		component: AdminProfileComponent
	}
];

// Componente temporal
@Component({
	selector: 'app-admin-profile',
	template: '<div>Perfil de Administrador - En desarrollo</div>'
})
export class AdminProfileComponent {}

@NgModule({
	declarations: [
		AdminProfileComponent
	],
	imports: [
		CommonModule,
		RouterModule.forChild(routes)
	]
})
export class AdminProfileModule {}
