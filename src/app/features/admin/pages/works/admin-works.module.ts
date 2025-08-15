import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

// Components
import { AdminWorksListComponent } from './components/admin-works-list/admin-works-list.component';
import { AdminWorkFormComponent } from './components/admin-work-form/admin-work-form.component';

// Shared Components
import { AdminComponentsModule } from '../../shared/components/admin-components.module';

// Services
import { AdminWorksService } from '../../shared/services/admin-works.service';

const routes: Routes = [
	{
		path: '',
		redirectTo: 'list',
		pathMatch: 'full'
	},
	{
		path: 'list',
		component: AdminWorksListComponent,
		data: { breadcrumb: 'Lista' }
	},
	{
		path: 'new',
		component: AdminWorkFormComponent,
		data: { breadcrumb: 'Nueva Experiencia' }
	},
	{
		path: 'edit/:id',
		component: AdminWorkFormComponent,
		data: { breadcrumb: 'Editar Experiencia' }
	}
];

@NgModule({
	declarations: [AdminWorksListComponent, AdminWorkFormComponent],
	imports: [
		CommonModule,
		ReactiveFormsModule,
		RouterModule.forChild(routes),
		AdminComponentsModule
	],
	providers: [AdminWorksService]
})
export class AdminWorksModule {}
