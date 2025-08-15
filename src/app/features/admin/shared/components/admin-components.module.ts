import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// Components
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';
import { AdminBreadcrumbComponent } from './admin-breadcrumb/admin-breadcrumb.component';
import { AdminStatsCardComponent } from './admin-stats-card/admin-stats-card.component';

@NgModule({
	declarations: [
		AdminLayoutComponent,
		AdminBreadcrumbComponent,
		AdminStatsCardComponent
	],
	imports: [CommonModule, RouterModule],
	exports: [
		AdminLayoutComponent,
		AdminBreadcrumbComponent,
		AdminStatsCardComponent
	]
})
export class AdminComponentsModule {}
