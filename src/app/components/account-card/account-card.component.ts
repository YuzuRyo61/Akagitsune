import { Component, Input } from '@angular/core';
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

  constructor() { }

}
