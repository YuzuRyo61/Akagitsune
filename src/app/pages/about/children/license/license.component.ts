import { Component, OnInit } from '@angular/core';
import txt from '!!raw-loader!../../../../../../LICENSE';
import packageJson from '../../../../../../package.json';
import { getName } from '@tauri-apps/api/app';

@Component({
  selector: 'app-license',
  templateUrl: './license.component.html',
  styleUrls: ['./license.component.scss']
})
export class LicenseComponent implements OnInit {
  licenseText: string = txt;
  name: string = packageJson.name;

  constructor() { }

  async ngOnInit() {
    this.name = await getName();
  }
}
