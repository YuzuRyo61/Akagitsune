import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainColumnComponent } from './main-column.component';
import { NgIconsModule } from '@ng-icons/core';
import { VirtualScrollerModule } from 'ngx-virtual-scroller';



@NgModule({
  declarations: [
    MainColumnComponent,
  ],
  imports: [
    CommonModule,
    NgIconsModule,
    VirtualScrollerModule,
  ],
  exports: [
    MainColumnComponent,
  ],
})
export class MainColumnModule { }
