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
} from '@ng-icons/material-icons/baseline';
import { MainColumnComponent } from './components/main-column/main-column.component';

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
    }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
