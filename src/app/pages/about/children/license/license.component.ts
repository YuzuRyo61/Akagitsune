import { Component, OnInit } from '@angular/core';
import packageJson from '../../../../../../package.json';
import { getName } from '@tauri-apps/api/app';

// License imports
import akagitsuneLicense from '!!raw-loader!../../../../../../LICENSE';
import { HttpClient } from '@angular/common/http';


interface LicenseList {
  name: string;
  body: string;
}

@Component({
  selector: 'app-license',
  templateUrl: './license.component.html',
  styleUrls: ['./license.component.scss']
})
export class LicenseComponent implements OnInit {
  licenseList: LicenseList[] = [];

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
    });

    this.hc.get('/3rdpartylicenses.txt', {responseType: 'text'})
      .subscribe({
        next: value => {
          this.licenseList.push({
              name: 'Angular etc (3rdpartylicenses.txt)',
              body: value,
            });
        }
      });
  }
}
