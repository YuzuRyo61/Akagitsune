import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountCardComponent } from './account-card.component';
import { NgIconsModule } from '@ng-icons/core';


@NgModule({
  declarations: [
    AccountCardComponent,
  ],
  imports: [
    CommonModule,
    NgIconsModule,
  ],
  exports: [
    AccountCardComponent,
  ]
})
export class AccountCardModule { }
