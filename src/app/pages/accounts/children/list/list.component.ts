import { Component } from '@angular/core';
import { AccountService } from '../../../../services/account.service';
import { Account } from '../../../../lib/account';
import { confirm } from '@tauri-apps/api/dialog';

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

  async deleteConfirm(account: Account) {
    const profileData = this.acs.accountProfile.get(account.id);
    let message: string;

    if (profileData) {
      message = `Are you sure delete @${ profileData.username }@${ account.address.toLowerCase() }?`;
    } else {
      message = `Are you sure delete ${ account.address.toLowerCase() }?`;
    }

    await confirm(
      message,
      {
        type: 'warning',
      }
    ).then(res => {
      if (res) this.acs.removeAccount(account.id);
    });
  }
}
