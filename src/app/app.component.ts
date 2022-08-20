import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ThemeService } from './services/theme.service';
import { Hotkey, HotkeysService } from 'angular2-hotkeys';
import { AccountService } from './services/account.service';
import { ColumnService } from './services/column.service';
import { getName } from '@tauri-apps/api/app';
import packageJson from '../../package.json';
import { Column } from './lib/column';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  composeDrawer = false;
  modal = false;
  @ViewChild('composeTextarea') private composeTextarea?: ElementRef;
  name = packageJson.name;

  private settingsShortcut?: Hotkey = new Hotkey('ctrl+,', (_: KeyboardEvent): boolean => {
    if (!this.router.url.startsWith('/settings')) {
      // noinspection JSIgnoredPromiseFromCall
      this.router.navigate(['/settings']);
    }
    return false;
  });

  private composeShortcut?: Hotkey = new Hotkey(['n', 'ctrl+n'], (_: KeyboardEvent): boolean => {
    if (this.router.url === '/') {
      this.composeDrawer = true;
      setTimeout(() => {
        this.composeTextarea?.nativeElement.focus();
      }, 0);
    }

    return false;
  });

  constructor(
    public router: Router,
    public ts: ThemeService,
    private hks: HotkeysService,
    private acs: AccountService,
    public cs: ColumnService,
  ) {
  }

  async ngOnInit() {
    if (this.settingsShortcut) this.hks.add(this.settingsShortcut);
    if (this.composeShortcut) this.hks.add(this.composeShortcut);

    this.hks.add(new Hotkey(['ctrl+/', 'ctrl+a'], (_: KeyboardEvent): boolean => false));

    this.acs.loadAccounts();
    this.acs.loadAppToken();
    this.cs.loadColumns();

    this.name = await getName();
  }

  toTitleCase(str: string): string {
    return str.charAt(0).replace(str.charAt(0), str.charAt(0).toUpperCase()) + str.slice(1);
  }

  columnButtonTitle(column: Column): string {
      const account = this.acs.account.get(column.account);
      if (account === undefined) return `${this.toTitleCase(column.type)} (???)`;

      const accountProfile = this.acs.accountProfile.get(column.account);
      if (accountProfile === undefined) return `${this.toTitleCase(column.type)} (${ account.address.toLowerCase() })`;

      return `${this.toTitleCase(column.type)} (@${ accountProfile.username }@${ account.address.toLowerCase() })`;
  }


  closeComposeDrawer() {
    this.composeDrawer = false;
    this.composeTextarea?.nativeElement.blur();
  }
}
