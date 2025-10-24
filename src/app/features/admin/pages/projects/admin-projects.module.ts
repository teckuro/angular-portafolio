import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

// Components
import { AdminProjectsListComponent } from './components/admin-projects-list/admin-projects-list.component';
import { AdminProjectFormComponent } from './components/admin-project-form/admin-project-form.component';

// Shared Components
import { AdminComponentsModule } from '../../shared/components/admin-components.module';
import { SharedModule } from '../../../../shared/shared.module';

// Services
import { AdminProjectsService } from '../../shared/services/admin-projects.service';

const routes: Routes = [
	{
		path: '',
		redirectTo: 'list',
		pathMatch: 'full'
	},
	{
		path: 'list',
		component: AdminProjectsListComponent,
		data: { breadcrumb: 'Lista' }
	},
	{
		path: 'new',
		component: AdminProjectFormComponent,
		data: { breadcrumb: 'Nuevo Proyecto' }
	},
	{
		path: 'edit/:id',
		component: AdminProjectFormComponent,
		data: { breadcrumb: 'Editar Proyecto' }
	}
];

@NgModule({
	declarations: [AdminProjectsListComponent, AdminProjectFormComponent],
	imports: [
		CommonModule,
		ReactiveFormsModule,
		RouterModule.forChild(routes),
		AdminComponentsModule,
		SharedModule
	],
	providers: [AdminProjectsService]
})
export class AdminProjectsModule {}
