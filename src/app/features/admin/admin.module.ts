import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// Components
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';

// Services
import { AdminAuthService } from './services/admin-auth.service';
import { AdminProjectsService } from './services/admin-projects.service';
import { AdminWorksService } from './services/admin-works.service';

// Guards
import { AdminAuthGuard } from '../../core/guards/admin-auth.guard';
import { AdminRoleGuard } from '../../core/guards/admin-role.guard';

// Routes
import { AdminRoutingModule } from './admin-routing.module';

@NgModule({
	declarations: [
		AdminLoginComponent,
		AdminDashboardComponent
	],
	imports: [
		CommonModule,
		ReactiveFormsModule,
		RouterModule,
		AdminRoutingModule
	],
	providers: [
		AdminAuthService,
		AdminProjectsService,
		AdminWorksService,
		AdminAuthGuard,
		AdminRoleGuard
	]
})
export class AdminModule {}
