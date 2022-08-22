import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Column } from '../../lib/column';
import { AccountService } from '../../services/account.service';
import { Account } from '../../lib/account';
import { TimelineService } from '../../services/timeline.service';
import { Statuses } from '../../lib/statuses';
import { Observable, Subscription } from 'rxjs';
import { IPageInfo } from 'ngx-virtual-scroller';


@Component({
  selector: 'app-main-column',
  templateUrl: './main-column.component.html',
  styleUrls: ['./main-column.component.scss'],
})
export class MainColumnComponent implements OnInit, OnDestroy {
  columnSettings = false;

  @Input() column?: Column;

  @Output() deleteButton: EventEmitter<Column> = new EventEmitter<Column>();

  items: Statuses[] = [];
  loading: boolean = true;

  private streamSubscription?: Subscription;

  constructor(
    private acs: AccountService,
    private ts: TimelineService,
  ) {
  }

  ngOnInit() {
    if (this.column === undefined) return;

    const account = this.acs.account.get(this.column.account);
    if (account === undefined) return;

    let timeline: Observable<Statuses[]> | undefined;
    let stream: Observable<Statuses> | undefined;

    switch (this.column.type) {
      case 'home':
        timeline = this.ts.homeTimeline(account);
        stream = this.ts.homeStream(account);
        break;
      case 'local':
        timeline = this.ts.localTimeline(account);
        stream = this.ts.localStream(account);
        break;
      case 'social':
        timeline = this.ts.socialTimeline(account);
        stream = this.ts.socialStream(account);
        break;
      case 'global':
        timeline = this.ts.globalTimeline(account);
        stream = this.ts.globalStream(account);
        break;
    }

    if (timeline !== undefined) {
      timeline.subscribe({
        next: value => {
          this.items = value;
        },
        complete: () => {
          this.loading = false;
        },
      });
    }

    if (stream !== undefined) {
      this.streamSubscription = stream.subscribe({
        next: value => {
          this.items.unshift(value);
        },
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

  fetchMore(event: IPageInfo) {
    if (event.endIndex !== this.items.length - 1) return;
    if (this.loading) return;

    if (this.column === undefined) return;

    const account = this.acs.account.get(this.column.account);
    if (account === undefined) return;

    this.loading = true;

    let timeline: Observable<Statuses[]> | undefined;
    const untilId = this.items[event.endIndex].id;

    switch (this.column.type) {
      case 'home':
        timeline = this.ts.homeTimeline(account, { untilId });
        break;
      case 'local':
        timeline = this.ts.localTimeline(account, { untilId });
        break;
      case 'social':
        if (this.account?.type === 'misskey') this.ts.socialTimeline(account, { untilId });
        break;
    }

    if (timeline !== undefined) {
      timeline.subscribe({
        next: value => {
          this.items = this.items.concat(value);
        },
        complete: () => {
          this.loading = false;
        },
      });
    }
  }
}
