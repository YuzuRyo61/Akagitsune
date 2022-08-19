import { Component, OnInit } from '@angular/core';
import { getName, getTauriVersion, getVersion } from '@tauri-apps/api/app';
import packageJson from '../../../../../../package.json';

@Component({
  selector: 'app-version',
  templateUrl: './version.component.html',
  styleUrls: ['./version.component.scss']
})
export class VersionComponent implements OnInit {
  name: string = packageJson.name;
  version: string = packageJson.version;
  tauriVersion: string = '(Unknown)';

  constructor() { }

  async ngOnInit() {
    try {
      this.name = await getName();
      this.version = await getVersion();
      this.tauriVersion = await getTauriVersion();
    } catch (e) {
      if (e instanceof TypeError) {
        console.warn('Cannot fetch tauri meta information.');
      } else {
        console.error(e);
      }
    }
  }

  get repositoryUrl(): string {
    return packageJson.repository.url;
  }

  get feedbackUrl(): string {
    return packageJson.bugs.url;
  }
}
