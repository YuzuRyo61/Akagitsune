import { Component } from '@angular/core';
import { AccountService } from '../../../../services/account.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class AccountListComponent {
  constructor(
    public acs: AccountService,
  ) {
  }

}
