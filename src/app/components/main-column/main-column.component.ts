import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Column } from '../../lib/column';
import { AccountService } from '../../services/account.service';
import { Account } from '../../lib/account';
import { TimelineService } from '../../services/timeline.service';
import { Statuses } from '../../lib/statuses';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-main-column',
  templateUrl: './main-column.component.html',
  styleUrls: ['./main-column.component.scss']
})
export class MainColumnComponent implements OnInit, OnDestroy {
  columnSettings = false;

  @Input() column?: Column;

  @Output() deleteButton: EventEmitter<Column> = new EventEmitter<Column>();

  items: Statuses[] = [];

  private streamSubscription?: Subscription;

  constructor(
    private acs: AccountService,
    private ts: TimelineService,
  ) { }

  ngOnInit() {
    if (this.column === undefined) return;

    const account = this.acs.account.get(this.column.account);
    if (account === undefined) return;

    switch (this.column.type) {
      case 'home':
        this.ts.homeTimeline(account).subscribe({
          next: value => {
            this.items.push(...value);
          }
        });
        this.streamSubscription = this.ts.homeStream(account).subscribe({
          next: value => {
            this.items.unshift(value);
          }
        });
    }
  }

  ngOnDestroy() {
    if (this.streamSubscription) this.streamSubscription.unsubscribe();
  }

  get acct(): string {
    if (this.column === undefined) return '';

    const account = this.acs.account.get(this.column.account);
    if (account === undefined) return '???';

    const accountProfile = this.acs.accountProfile.get(this.column.account);
    if (accountProfile === undefined) return `${ account.address.toLowerCase() }`;

    return `@${ accountProfile.username }@${ account.address.toLowerCase() }`;
  }

  get account(): Account | undefined {
    if (this.column === undefined) return undefined;

    return this.acs.account.get(this.column.account);
  }

  viewPortItemsCast(val: any[]): Statuses[] {
    return val as Statuses[];
  }

}
