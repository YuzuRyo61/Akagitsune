import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Column } from '../../lib/column';
import { AccountService } from '../../services/account.service';

@Component({
  selector: 'app-main-column',
  templateUrl: './main-column.component.html',
  styleUrls: ['./main-column.component.scss']
})
export class MainColumnComponent {
  columnSettings = false;

  @Input() column?: Column;

  @Output() deleteButton: EventEmitter<Column> = new EventEmitter<Column>();

  get acct(): string {
    if (this.column === undefined) return '';

    const account = this.acs.account.get(this.column.account);
    if (account === undefined) return '???';

    const accountProfile = this.acs.accountProfile.get(this.column.account);
    if (accountProfile === undefined) return `${ account.address.toLowerCase() }`;

    return `@${ accountProfile.username }@${ account.address.toLowerCase() }`;
  }

  constructor(
    private acs: AccountService,
  ) { }

}
