import { Component, OnInit } from '@angular/core';
import { Hotkey, HotkeysService } from 'angular2-hotkeys';
import { Router } from '@angular/router';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.scss']
})
export class AccountsComponent implements OnInit {
  constructor(
    private hks: HotkeysService,
    private router: Router,
  ) { }

  private escShortcut?: Hotkey;

  name?: string;
  version?: string;

  ngOnInit() {
    this.escShortcut = new Hotkey('esc', (_: KeyboardEvent): boolean => {
      this.router.navigate(['/']).then(() => {
        if (this.escShortcut) this.hks.remove(this.escShortcut);
      });
      return false;
    });

    this.hks.add(this.escShortcut);
  }
}
