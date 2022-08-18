import { Component, OnInit } from '@angular/core';
import { Hotkey, HotkeysService } from 'angular2-hotkeys';
import { Router } from '@angular/router';
import { getName, getVersion } from '@tauri-apps/api/app';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {
  constructor(
    private hks: HotkeysService,
    private router: Router,
  ) { }

  private escShortcut?: Hotkey;

  name?: string;
  version?: string;

  async ngOnInit() {
    this.escShortcut = new Hotkey('esc', (_: KeyboardEvent): boolean => {
      this.router.navigate(['/']).then(() => {
        if (this.escShortcut) this.hks.remove(this.escShortcut);
      });
      return false;
    });

    this.hks.add(this.escShortcut);

    this.name = await getName();
    this.version = await getVersion();
  }
}
