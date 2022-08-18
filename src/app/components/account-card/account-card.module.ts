import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountCardComponent } from './account-card.component';
import { NgIconsModule } from '@ng-icons/core';
import {
  MatDelete,
} from '@ng-icons/material-icons/baseline';


@NgModule({
  declarations: [
    AccountCardComponent,
  ],
  imports: [
    CommonModule,
    NgIconsModule.withIcons({
      MatDelete,
    }),
  ],
  exports: [
    AccountCardComponent,
  ]
})
export class AccountCardModule { }
