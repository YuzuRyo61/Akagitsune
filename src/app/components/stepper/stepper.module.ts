import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StepperComponent } from './stepper.component';
import { CdkStepperModule } from '@angular/cdk/stepper';


@NgModule({
  declarations: [
    StepperComponent,
  ],
  exports: [
    StepperComponent,
    CdkStepperModule,
  ],
  imports: [
    CommonModule,
    CdkStepperModule,
  ],
})
export class StepperModule { }
