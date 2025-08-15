import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// Components
import { AdminLoginComponent } from './pages/login/admin-login.component';
import { AdminDashboardComponent } from './pages/dashboard/admin-dashboard.component';

// Shared Components
import { AdminComponentsModule } from './shared/components/admin-components.module';

// Services
import { AdminAuthService } from './shared/services/admin-auth.service';
import { AdminWorksService } from './shared/services/admin-works.service';
import { AdminProjectsService } from './shared/services/admin-projects.service';

// Guards
import { AdminAuthGuard } from '../../core/guards/admin-auth.guard';

// Routes
import { AdminRoutingModule } from './admin-routing.module';

@NgModule({
	declarations: [AdminLoginComponent, AdminDashboardComponent],
	imports: [
		CommonModule,
		ReactiveFormsModule,
		RouterModule,
		AdminRoutingModule,
		AdminComponentsModule
	],
	providers: [
		AdminAuthService,
		AdminWorksService,
		AdminProjectsService,
		AdminAuthGuard
	]
})
export class AdminModule {}
