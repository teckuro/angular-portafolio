import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

// Services
import { LoggerService } from './logger.service';

// Interceptors
import { AdminAuthInterceptor } from './interceptors/admin-auth.interceptor';

// Guards
import { AdminAuthGuard } from './guards/admin-auth.guard';
import { AdminRoleGuard } from './guards/admin-role.guard';

@NgModule({
	declarations: [],
	imports: [CommonModule],
	providers: [
		// Core services
		LoggerService,

		// Interceptors
		{
			provide: HTTP_INTERCEPTORS,
			useClass: AdminAuthInterceptor,
			multi: true
		},

		// Guards
		AdminAuthGuard,
		AdminRoleGuard
	]
})
export class CoreModule {
	constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
		if (parentModule) {
			throw new Error(
				'CoreModule ya está cargado. Solo debe importarse en AppModule.'
			);
		}
	}
}
