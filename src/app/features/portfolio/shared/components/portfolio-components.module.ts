import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Components
import { WorkCardComponent } from './work-card/work-card.component';
import { ProjectCardComponent } from './project-card/project-card.component';

@NgModule({
	declarations: [WorkCardComponent, ProjectCardComponent],
	imports: [CommonModule],
	exports: [WorkCardComponent, ProjectCardComponent]
})
export class PortfolioComponentsModule {}
