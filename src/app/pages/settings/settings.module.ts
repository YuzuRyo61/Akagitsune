import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsComponent } from './settings.component';
import { RouterModule } from '@angular/router';
import { NgIconsModule } from '@ng-icons/core';
import {
  MatSettings,
  MatBrush,
} from '@ng-icons/material-icons/baseline';
import { GeneralSettingsComponent } from './children/general/general.component';
import { ThemeSettingsComponent } from './children/theme/theme.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HotkeyModule } from 'angular2-hotkeys';


@NgModule({
  declarations: [
    SettingsComponent,
    GeneralSettingsComponent,
    ThemeSettingsComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: SettingsComponent,
        children: [
          {
            path: '',
            redirectTo: 'general',
            pathMatch: 'full',
          },
          {
            path: 'general',
            component: GeneralSettingsComponent,
          },
          {
            path: 'theme',
            component: ThemeSettingsComponent,
          },
        ],
      },
    ]),
    NgIconsModule.withIcons({
      MatSettings,
      MatBrush,
    }),
    ReactiveFormsModule,
    FormsModule,
    HotkeyModule,
  ],
})
export class SettingsModule { }
