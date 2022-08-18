import { Component } from '@angular/core';
import { Theme, themeList } from '../../../../lib/theme';
import { ThemeService } from '../../../../services/theme.service';

@Component({
  selector: 'app-theme',
  templateUrl: './theme.component.html',
  styleUrls: ['./theme.component.scss']
})
export class ThemeSettingsComponent {
  constructor(
    public ts: ThemeService,
  ) { }

  get themeList(): Theme[] {
    return themeList;
  }
}
