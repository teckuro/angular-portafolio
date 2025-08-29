import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

// Shared Components
import { SharedModule } from '../../../../shared/shared.module';

// Components
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';
import { AdminBreadcrumbComponent } from './admin-breadcrumb/admin-breadcrumb.component';
import { AdminStatsCardComponent } from './admin-stats-card/admin-stats-card.component';
import { ImageUploadComponent } from './image-upload/image-upload.component';
import { CustomSelectComponent } from './custom-select/custom-select.component';

@NgModule({
	declarations: [
		AdminLayoutComponent,
		AdminBreadcrumbComponent,
		AdminStatsCardComponent,
		ImageUploadComponent,
		CustomSelectComponent
	],
	imports: [CommonModule, RouterModule, ReactiveFormsModule, SharedModule],
	exports: [
		AdminLayoutComponent,
		AdminBreadcrumbComponent,
		AdminStatsCardComponent,
		ImageUploadComponent,
		CustomSelectComponent
	]
})
export class AdminComponentsModule {}
