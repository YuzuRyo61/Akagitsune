import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AComponent } from './a.component';
import { RouterModule, Routes } from '@angular/router';
import { NgIconComponent } from '@ng-icons/core';
import { AUserComponent } from './children/user/user.component';
import { APostComponent } from './children/post/post.component';


const routes: Routes = [{
  path: ':accountId',
  component: AComponent,
  children: [
    {
      path: 'user/:userId',
      component: AUserComponent,
    },
    {
      path: 'post/:postId',
      component: APostComponent,
    },
  ]
}];

@NgModule({
  declarations: [
    AComponent,
    AUserComponent,
    APostComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    NgIconComponent,
  ],
})
export class AModule { }
