import { Component } from '@angular/core';
import { AccountType } from '../../../../lib/account-type';
import { AccountService } from '../../../../services/account.service';
import { Instance } from '../../../../lib/instance';

@Component({
  selector: 'app-add',
  templateUrl: './account-add.component.html',
  styleUrls: ['./account-add.component.scss']
})
export class AccountAddComponent {
  instanceType?: AccountType;
  instanceAddress: string = '';
  instanceInfo?: Instance;
  instanceFetchError = false;
  instanceFetchLoading = true;

  constructor(
    private acs: AccountService,
  ) { }

  checkInstance() {
    if (this.instanceType === undefined) return;
    this.instanceFetchError = false;
    this.instanceFetchLoading = true;

    this.acs.checkInstance(this.instanceAddress, this.instanceType).subscribe({
      next: value => {
        this.instanceInfo = value;
      },
      error: err => {
        console.error(err);
        this.instanceFetchError = true;
        this.instanceFetchLoading = false;
      },
      complete: () => {
        this.instanceFetchLoading = false;
      }
    });
  }
}
