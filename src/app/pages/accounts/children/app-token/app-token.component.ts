import { Component } from '@angular/core';
import { AccountService } from '../../../../services/account.service';

@Component({
  selector: 'app-app-token',
  templateUrl: './app-token.component.html',
  styleUrls: ['./app-token.component.scss']
})
export class AccountAppTokenComponent {
  deleteConfirmModal = false;
  deleteTarget = '';

  constructor(
    public acs: AccountService,
  ) {
  }

  deleteConfirm(key: string) {
    this.deleteConfirmModal = true;
    this.deleteTarget = key;
  }

  deleteAppToken() {
    this.acs.removeAppToken(this.deleteTarget);
    this.deleteConfirmModal = false;
  }
}
