import { Component } from '@angular/core';
import { AccountService } from '../../../../services/account.service';
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

  async deleteConfirm(key: string) {
    const account = this.acs.account.get(key);
    if (account === undefined) return;

    const profileData = this.acs.accountProfile.get(key);
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
      if (res) this.acs.removeAccount(key);
    });
  }
}
