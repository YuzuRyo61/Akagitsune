import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Account } from '../../lib/account';
import { AccountProfile } from '../../lib/account-profile';

@Component({
  selector: 'app-account-card',
  templateUrl: './account-card.component.html',
  styleUrls: ['./account-card.component.scss']
})
export class AccountCardComponent {
  @Input() account?: Account;
  @Input() accountProfile?: AccountProfile;

  @Output() deleteButtonClicked: EventEmitter<Account> = new EventEmitter<Account>();

  constructor() { }

  deleteButton() {
    if (this.account === undefined) return;

    this.deleteButtonClicked.emit(this.account);
  }
}
