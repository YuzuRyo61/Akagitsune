import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainColumnComponent } from './main-column.component';
import { NgIconsModule } from '@ng-icons/core';
import { VirtualScrollerModule } from 'ngx-virtual-scroller';
import { MainColumnItemNormalModule } from '../main-column-item-normal/main-column-item-normal.module';



@NgModule({
  declarations: [
    MainColumnComponent,
  ],
  imports: [
    CommonModule,
    NgIconsModule,
    VirtualScrollerModule,
    MainColumnItemNormalModule,
  ],
  exports: [
    MainColumnComponent,
  ],
})
export class MainColumnModule { }
