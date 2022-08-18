import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  composeDrawer = false;
  modal = false;

  constructor(
    public router: Router,
    public ts: ThemeService,
  ) {
  }
}
