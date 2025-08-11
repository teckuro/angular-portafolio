import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioPageComponent } from './portfolio-page/portfolio-page.component';
import { ProjectCardComponent } from './project-card/project-card.component';

@NgModule({
	declarations: [PortfolioPageComponent, ProjectCardComponent],
	imports: [CommonModule]
})
export class PortfolioModule {}
