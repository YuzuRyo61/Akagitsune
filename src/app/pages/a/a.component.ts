import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from '../../services/account.service';
import { Account } from '../../lib/account';
import { Hotkey, HotkeysService } from 'angular2-hotkeys';

@Component({
  selector: 'app-a',
  templateUrl: './a.component.html',
  styleUrls: ['./a.component.scss']
})
export class AComponent implements OnInit {
  account?: Account;

  private escShortcut?: Hotkey;

  constructor(
    public route: ActivatedRoute,
    private router: Router,
    private hks: HotkeysService,
    private acs: AccountService,
  ) {
  }

  ngOnInit() {
    this.escShortcut = new Hotkey('esc', (_: KeyboardEvent): boolean => {
      this.router.navigate(['/']).then(() => {
        if (this.escShortcut) this.hks.remove(this.escShortcut);
      });
      return false;
    });

    this.hks.add(this.escShortcut);

    const accountId = this.route.snapshot.paramMap.get('accountId');
    if (accountId === null) return;
    this.account = this.acs.account.get(accountId);
  }
}
