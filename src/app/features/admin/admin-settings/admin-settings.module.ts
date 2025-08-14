import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { Component } from '@angular/core';

const routes: Routes = [
	{
		path: '',
		component: AdminSettingsComponent
	}
];

// Componente temporal
@Component({
	selector: 'app-admin-settings',
	template: '<div>Configuración del Sistema - En desarrollo</div>'
})
export class AdminSettingsComponent {}

@NgModule({
	declarations: [
		AdminSettingsComponent
	],
	imports: [
		CommonModule,
		RouterModule.forChild(routes)
	]
})
export class AdminSettingsModule {}
