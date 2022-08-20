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
  MatDelete,
  MatInfo,
  MatVerified,
  MatAccountCircle,
  MatToken,
  MatError,
  MatBrush,
  MatGroups,
  MatPublic,
  MatShare,
  MatNavigateBefore,
  MatNavigateNext,
  MatReply,
  MatRepeat,
  MatStar,
  MatAddReaction,
  MatMoreHoriz,
} from '@ng-icons/material-icons/baseline';
import { FormsModule } from '@angular/forms';
import { HotkeyModule } from 'angular2-hotkeys';
import { ThemeService } from './services/theme.service';
import { AccountService } from './services/account.service';
import { HttpClientModule } from '@angular/common/http';
import { ColumnService } from './services/column.service';
import { MainColumnModule } from './components/main-column/main-column.module';
import { TimelineService } from './services/timeline.service';


@NgModule({
  declarations: [
    AppComponent,
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
      MatDelete,
      MatInfo,
      MatVerified,
      MatAccountCircle,
      MatToken,
      MatError,
      MatBrush,
      MatGroups,
      MatPublic,
      MatShare,
      MatNavigateBefore,
      MatNavigateNext,
      MatReply,
      MatRepeat,
      MatStar,
      MatAddReaction,
      MatMoreHoriz,
    }),
    FormsModule,
    HotkeyModule.forRoot({}),
    HttpClientModule,
    MainColumnModule,
  ],
  providers: [
    ThemeService,
    AccountService,
    ColumnService,
    TimelineService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
}
