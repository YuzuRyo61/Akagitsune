import { Component, OnInit } from '@angular/core';
import packageJson from '../../../../../../package.json';
import { getName } from '@tauri-apps/api/app';
import { HttpClient } from '@angular/common/http';

// License imports
import akagitsuneLicense from '!!raw-loader!../../../../../../LICENSE';
import tauriApache from '!!raw-loader!./3rd-party-licenses/tauri-apache-2.0.txt';
import tauriMit from '!!raw-loader!./3rd-party-licenses/tauri-mit.txt';


interface LicenseList {
  name: string;
  url?: string;
  body: string;
}

@Component({
  selector: 'app-license',
  templateUrl: './license.component.html',
  styleUrls: ['./license.component.scss']
})
export class LicenseComponent implements OnInit {
  licenseList: LicenseList[] = [
    {
      name: 'tauri',
      url: 'https://github.com/tauri-apps/tauri',
      body: tauriApache + '\n\n' + tauriMit,
    }
  ];

  constructor(
    private hc: HttpClient,
  ) { }

  async ngOnInit() {
    let projectName = packageJson.name;
    try {
      projectName = await getName();
    } catch (_) { }

    this.licenseList.unshift({
      name: projectName,
      body: akagitsuneLicense,
      url: packageJson.repository.url,
    });

    this.hc.get('/3rdpartylicenses.txt', {responseType: 'text'})
      .subscribe({
        next: value => {
          this.licenseList.push({
              name: '3rd party licenses using in Angular (3rdpartylicenses.txt)',
              body: value,
            });
        }
      });
  }
}
