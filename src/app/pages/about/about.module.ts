import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AboutComponent } from './about.component';
import { RouterModule } from '@angular/router';
import { VersionComponent } from './children/version/version.component';
import { NgIconsModule } from '@ng-icons/core';
import { LicenseComponent } from './children/license/license.component';
import {
  MatInfo,
  MatVerified,
} from '@ng-icons/material-icons/baseline';


@NgModule({
  declarations: [
    AboutComponent,
    VersionComponent,
    LicenseComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([{
      path: '',
      component: AboutComponent,
      children: [
        {
          path: '',
          redirectTo: 'version',
          pathMatch: 'full',
        },
        {
          path: 'version',
          component: VersionComponent,
        },
        {
          path: 'license',
          component: LicenseComponent,
        }
      ]
    }]),
    NgIconsModule.withIcons({
      MatInfo,
      MatVerified,
    }),
  ],
})
export class AboutModule { }
