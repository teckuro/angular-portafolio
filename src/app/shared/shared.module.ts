import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';
import { SafeImageComponent } from './components/safe-image/safe-image.component';

@NgModule({
  declarations: [
    LoadingSpinnerComponent,
    SafeImageComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    LoadingSpinnerComponent,
    SafeImageComponent
  ]
})
export class SharedModule { }
