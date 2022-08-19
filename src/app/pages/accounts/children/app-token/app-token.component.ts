import { Component } from '@angular/core';
import { AccountService } from '../../../../services/account.service';
import { confirm } from '@tauri-apps/api/dialog';


@Component({
  selector: 'app-app-token',
  templateUrl: './app-token.component.html',
  styleUrls: ['./app-token.component.scss']
})
export class AccountAppTokenComponent {

  constructor(
    public acs: AccountService,
  ) {
  }

  async deleteConfirm(key: string) {
    await confirm(
      `Are you sure delete ${ key }'s app token?`,
      {
        type: 'warning',
      }
    ).then(res => {
      if (res) this.acs.removeAppToken(key);
    });
  }

}
