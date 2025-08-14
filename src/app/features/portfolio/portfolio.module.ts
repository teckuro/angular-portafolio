import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { PortfolioPageComponent } from './portfolio-page/portfolio-page.component';
import { ProjectCardComponent } from './project-card/project-card.component';
import { WorkCardComponent } from './work-card/work-card.component';
import { SharedModule } from '../../shared/shared.module';

const routes: Routes = [{ path: '', component: PortfolioPageComponent }];

@NgModule({
	declarations: [
		PortfolioPageComponent,
		ProjectCardComponent,
		WorkCardComponent
	],
	imports: [CommonModule, RouterModule.forChild(routes), SharedModule]
})
export class PortfolioModule {}
