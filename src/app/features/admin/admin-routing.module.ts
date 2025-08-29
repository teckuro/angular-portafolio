import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminLoginComponent } from './pages/login/admin-login.component';
import { AdminDashboardComponent } from './pages/dashboard/admin-dashboard.component';
import { AdminAuthGuard } from '../../core/guards/admin-auth.guard';

const routes: Routes = [
	{
		path: 'login',
		component: AdminLoginComponent
	},
	{
		path: 'dashboard',
		component: AdminDashboardComponent,
		canActivate: [AdminAuthGuard],
		data: { breadcrumb: 'Dashboard' }
	},
	{
		path: 'works',
		loadChildren: () =>
			import('./pages/works/admin-works.module').then(
				(m) => m.AdminWorksModule
			),
		canActivate: [AdminAuthGuard],
		data: { breadcrumb: 'Experiencia Laboral' }
	},
	{
		path: 'projects',
		loadChildren: () =>
			import('./pages/projects/admin-projects.module').then(
				(m) => m.AdminProjectsModule
			),
		canActivate: [AdminAuthGuard],
		data: { breadcrumb: 'Proyectos' }
	},
	{
		path: '',
		redirectTo: 'dashboard',
		pathMatch: 'full'
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class AdminRoutingModule {}
