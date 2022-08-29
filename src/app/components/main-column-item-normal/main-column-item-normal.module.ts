import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainColumnItemNormalComponent } from './main-column-item-normal.component';
import { NgIconComponent } from '@ng-icons/core';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    MainColumnItemNormalComponent,
  ],
  imports: [
    CommonModule,
    NgIconComponent,
    RouterModule,
  ],
  exports: [
    MainColumnItemNormalComponent,
  ],
})
export class MainColumnItemNormalModule { }
