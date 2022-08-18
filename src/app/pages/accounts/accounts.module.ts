import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountsComponent } from './accounts.component';
import { RouterModule } from '@angular/router';
import { AccountCardModule } from '../../components/account-card/account-card.module';
import { NgIconsModule } from '@ng-icons/core';
import {
  MatAccountCircle,
  MatPlus,
  MatToken,
  MatError,
  MatInfo,
} from '@ng-icons/material-icons/baseline';
import { AccountListComponent } from './children/list/list.component';
import { AccountAddComponent } from './children/add/account-add.component';
import { AccountAppTokenComponent } from './children/app-token/app-token.component';
import { StepperModule } from '../../components/stepper/stepper.module';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    AccountsComponent,
    AccountListComponent,
    AccountAddComponent,
    AccountAppTokenComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: AccountsComponent,
        children: [
          {
            path: '',
            redirectTo: 'list',
            pathMatch: 'full',
          },
          {
            path: 'list',
            component: AccountListComponent,
          },
          {
            path: 'add',
            component: AccountAddComponent,
          },
          {
            path: 'app-token',
            component: AccountAppTokenComponent,
          },
        ],
      },
    ]),
    AccountCardModule,
    NgIconsModule.withIcons({
      MatAccountCircle,
      MatPlus,
      MatToken,
      MatError,
      MatInfo,
    }),
    StepperModule,
    FormsModule,
  ],
})
export class AccountsModule { }
