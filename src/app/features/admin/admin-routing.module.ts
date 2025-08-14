import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AdminAuthGuard } from '../../core/guards/admin-auth.guard';
import { AdminRoleGuard } from '../../core/guards/admin-role.guard';

const routes: Routes = [
	{
		path: 'login',
		component: AdminLoginComponent
	},
	{
		path: 'dashboard',
		component: AdminDashboardComponent,
		canActivate: [AdminAuthGuard]
	},
	{
		path: 'projects',
		loadChildren: () => import('./admin-projects/admin-projects.module').then(m => m.AdminProjectsModule),
		canActivate: [AdminAuthGuard]
	},
	{
		path: 'works',
		loadChildren: () => import('./admin-works/admin-works.module').then(m => m.AdminWorksModule),
		canActivate: [AdminAuthGuard]
	},
	{
		path: 'profile',
		loadChildren: () => import('./admin-profile/admin-profile.module').then(m => m.AdminProfileModule),
		canActivate: [AdminAuthGuard]
	},
	{
		path: 'settings',
		loadChildren: () => import('./admin-settings/admin-settings.module').then(m => m.AdminSettingsModule),
		canActivate: [AdminAuthGuard, AdminRoleGuard],
		data: { role: 'super_admin' }
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
