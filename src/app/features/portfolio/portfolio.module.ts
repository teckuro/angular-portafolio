import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// Components
import { PortfolioPageComponent } from './pages/home/portfolio-page.component';

// Shared Components
import { PortfolioComponentsModule } from './shared/components/portfolio-components.module';
import { SharedModule } from '../../shared/shared.module';

// Services
import { WorksService } from './shared/services/works.service';
import { ProjectsService } from './shared/services/projects.service';

// Routes
import { PortfolioRoutingModule } from './portfolio-routing.module';

@NgModule({
	declarations: [PortfolioPageComponent],
	imports: [
		CommonModule,
		RouterModule,
		PortfolioRoutingModule,
		PortfolioComponentsModule,
		SharedModule
	],
	providers: [WorksService, ProjectsService]
})
export class PortfolioModule {}
