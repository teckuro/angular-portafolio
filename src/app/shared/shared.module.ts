import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';
import { SafeImageComponent } from './components/safe-image/safe-image.component';
import { ThemeToggleComponent } from './components/theme-toggle/theme-toggle.component';

@NgModule({
  declarations: [
    LoadingSpinnerComponent,
    SafeImageComponent,
    ThemeToggleComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    LoadingSpinnerComponent,
    SafeImageComponent,
    ThemeToggleComponent
  ]
})
export class SharedModule { }
