import { Component, ViewChild } from '@angular/core';
import { AccountType } from '../../../../lib/account-type';
import { AccountService } from '../../../../services/account.service';
import { Instance } from '../../../../lib/instance';
import { open } from '@tauri-apps/api/shell';
import { writeText } from '@tauri-apps/api/clipboard';
import { StepperComponent } from '../../../../components/stepper/stepper.component';
import { IssueToken } from '../../../../lib/issue-token';

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
  instanceAuthenticationError = false;
  instanceAuthenticationURL: string = '';
  authorizeError = false;
  authorizeLoading = false;
  authorizeCode: string = '';

  private sessionId: string = '';

  @ViewChild('stepper') stepper?: StepperComponent;

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

  async startAuthentication() {
    if (this.instanceType === undefined) return;
    this.instanceAuthenticationError = false;

    this.acs.issueAuthorizeURL(this.instanceAddress, this.instanceType).subscribe({
      next: async value => {
        this.instanceAuthenticationURL = value.url;
        // noinspection JSIgnoredPromiseFromCall
        await open(value.url);
        if (value.sessionId) this.sessionId = value.sessionId;
      },
      error: err => {
        console.error(err);
        this.instanceAuthenticationError = true;
      }
    });
  }

  async copyAuthenticationURL() {
    if (this.instanceAuthenticationURL === '') return;
    await writeText(this.instanceAuthenticationURL);
  }

  resetStep() {
    this.instanceInfo = undefined;
    this.instanceType = undefined;
    this.instanceAddress = '';

    this.stepper?.reset();
  }

  authorizeStep() {
    if (this.instanceType === undefined) return;

    this.authorizeError = false;
    this.authorizeLoading = true;

    let issueTokenData: IssueToken | undefined = undefined;

    switch (this.instanceType) {
      case 'mastodon':
        issueTokenData = {
          code: this.authorizeCode,
        };
        break;
      case 'misskey':
        issueTokenData = {
          code: this.sessionId,
        };
        break;
    }

    if (issueTokenData === undefined) return;

    this.acs.issueToken(
      this.instanceAddress,
      this.instanceType,
      issueTokenData
    ).subscribe({
      next: value => {
        if (this.instanceType === undefined) return;

        this.acs.addAccount(
          this.instanceAddress,
          this.instanceType,
          value,
        );
      },
      error: err => {
        console.error(err);
        this.authorizeError = true;
        this.authorizeLoading = false;
      },
      complete: () => {
        this.authorizeLoading = false;
        this.stepper?.next();
      }
    });
  }
}
