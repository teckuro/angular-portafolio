import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

// Components
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';
import { AdminBreadcrumbComponent } from './admin-breadcrumb/admin-breadcrumb.component';
import { AdminStatsCardComponent } from './admin-stats-card/admin-stats-card.component';
import { ImageUploadComponent } from './image-upload/image-upload.component';

@NgModule({
	declarations: [
		AdminLayoutComponent,
		AdminBreadcrumbComponent,
		AdminStatsCardComponent,
		ImageUploadComponent
	],
	imports: [CommonModule, RouterModule, ReactiveFormsModule],
	exports: [
		AdminLayoutComponent,
		AdminBreadcrumbComponent,
		AdminStatsCardComponent,
		ImageUploadComponent
	]
})
export class AdminComponentsModule {}
