import { Component } from '@angular/core';
import { AccountService } from '../../../../services/account.service';
import { Account } from '../../../../lib/account';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class AccountListComponent {
  deleteConfirmModal = false;
  deleteTarget?: Account;

  constructor(
    public acs: AccountService,
  ) {
  }

  deleteConfirm(account: Account): void {
    this.deleteConfirmModal = true;
    this.deleteTarget = account;
  }

  deleteAccount(): void {
    if (this.deleteTarget === undefined) return;
    this.acs.removeAccount(this.deleteTarget.id);
    this.deleteConfirmModal = false;
  }
}
