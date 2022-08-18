import { Component, OnInit } from '@angular/core';
import { Hotkey, HotkeysService } from 'angular2-hotkeys';
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  constructor(
    private hks: HotkeysService,
    private router: Router,
  ) { }

  private escShortcut?: Hotkey;

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
