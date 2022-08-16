import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgIconsModule } from '@ng-icons/core';
import {
  MatHome,
  MatMenu,
} from '@ng-icons/material-icons/baseline';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgIconsModule.withIcons({
      MatHome,
      MatMenu,
    }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
