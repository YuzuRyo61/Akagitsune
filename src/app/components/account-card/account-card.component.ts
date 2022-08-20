import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Account } from '../../lib/account';
import { AccountProfile } from '../../lib/account-profile';
import { AccountService } from '../../services/account.service';

@Component({
  selector: 'app-account-card',
  templateUrl: './account-card.component.html',
  styleUrls: ['./account-card.component.scss']
})
export class AccountCardComponent implements OnInit {
  @Input() accountId?: string;

  account?: Account;
  accountProfile?: AccountProfile;

  @Output() deleteButtonClicked: EventEmitter<string> = new EventEmitter<string>();

  constructor(
    public acs: AccountService,
  ) { }

  ngOnInit() {
    if (this.accountId === undefined) return;
    this.account = this.acs.account.get(this.accountId);
    this.accountProfile = this.acs.accountProfile.get(this.accountId);
  }

  deleteButton() {
    if (this.accountId === undefined) return;

    this.deleteButtonClicked.emit(this.accountId);
  }
}
