import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddComponent } from './add.component';
import { RouterModule } from '@angular/router';
import { StepperModule } from '../../components/stepper/stepper.module';
import { FormsModule } from '@angular/forms';
import { NgIconComponent } from '@ng-icons/core';


@NgModule({
  declarations: [
    AddComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([{
      path: '',
      component: AddComponent,
    }]),
    StepperModule,
    FormsModule,
    NgIconComponent,
  ],
})
export class AddModule { }
