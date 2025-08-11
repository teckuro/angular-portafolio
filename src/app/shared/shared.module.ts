import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectCardComponent } from './components/project-card/project-card.component';
import { SkillProgressComponent } from './components/skill-progress/skill-progress.component';
import { ExamplePipe } from './pipes/example.pipe';



@NgModule({
  declarations: [
    ProjectCardComponent,
    SkillProgressComponent,
    ExamplePipe
  ],
  imports: [
    CommonModule
  ]
})
export class SharedModule { }
