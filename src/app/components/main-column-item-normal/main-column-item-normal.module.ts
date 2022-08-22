import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainColumnItemNormalComponent } from './main-column-item-normal.component';
import { NgIconComponent } from '@ng-icons/core';



@NgModule({
  declarations: [
    MainColumnItemNormalComponent,
  ],
  imports: [
    CommonModule,
    NgIconComponent,
  ],
  exports: [
    MainColumnItemNormalComponent,
  ],
})
export class MainColumnItemNormalModule { }
