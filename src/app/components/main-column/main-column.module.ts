import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainColumnComponent } from './main-column.component';
import { NgIconsModule } from '@ng-icons/core';



@NgModule({
  declarations: [
    MainColumnComponent,
  ],
  imports: [
    CommonModule,
    NgIconsModule,
  ],
  exports: [
    MainColumnComponent,
  ],
})
export class MainColumnModule { }
