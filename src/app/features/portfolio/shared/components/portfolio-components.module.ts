import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../../shared/shared.module';

// Components
import { WorkCardComponent } from './work-card/work-card.component';
import { ProjectCardComponent } from './project-card/project-card.component';

@NgModule({
	declarations: [WorkCardComponent, ProjectCardComponent],
	imports: [CommonModule, SharedModule],
	exports: [WorkCardComponent, ProjectCardComponent]
})
export class PortfolioComponentsModule {}
