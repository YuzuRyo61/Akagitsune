import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AComponent } from './a.component';
import { RouterModule, Routes } from '@angular/router';
import { NgIconComponent } from '@ng-icons/core';


const routes: Routes = [{
  path: ':id',
  component: AComponent,
  children: [
    {
      path: '**',
      children: [],
    }
  ]
}];

@NgModule({
  declarations: [
    AComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    NgIconComponent,
  ],
})
export class AModule { }
