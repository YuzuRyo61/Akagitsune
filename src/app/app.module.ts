import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgIconsModule } from '@ng-icons/core';
import {
  MatHome,
  MatMenu,
  MatEdit,
  MatManageAccounts,
  MatSettings,
  MatHelp,
  MatPlus,
} from '@ng-icons/material-icons/baseline';
import { MainColumnComponent } from './components/main-column/main-column.component';
import { FormsModule } from '@angular/forms';
import { HotkeyModule } from 'angular2-hotkeys';
import { ThemeService } from './services/theme.service';
import { AccountService } from './services/account.service';
import { HttpClientModule } from '@angular/common/http';
import { ColumnService } from './services/column.service';


@NgModule({
  declarations: [
    AppComponent,
    MainColumnComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgIconsModule.withIcons({
      MatHome,
      MatMenu,
      MatEdit,
      MatManageAccounts,
      MatSettings,
      MatHelp,
      MatPlus,
    }),
    FormsModule,
    HotkeyModule.forRoot({

    }),
    HttpClientModule,
  ],
  providers: [
    ThemeService,
    AccountService,
    ColumnService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
