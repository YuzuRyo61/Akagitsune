import { Component } from '@angular/core';
import { AccountType } from '../../../../lib/account-type';

@Component({
  selector: 'app-add',
  templateUrl: './account-add.component.html',
  styleUrls: ['./account-add.component.scss']
})
export class AccountAddComponent {
  instanceType?: AccountType;
  instanceAddress: string = '';

  constructor() { }

  checkInstance() {
    console.log(`Checking instance: ${ this.instanceAddress }`);
  }
}
