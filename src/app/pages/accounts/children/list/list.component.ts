import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../../../services/account.service';
import { Account } from '../../../../lib/account';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class AccountListComponent implements OnInit {
  accounts: Account[] = [];

  constructor(
    public acs: AccountService,
  ) {
  }

  ngOnInit() {
    this.accounts = this.acs.fetchAccounts()
  }
}
