import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ElectriciteComponent} from './electricite/electricite.component';
import {ElectricitegazComponent} from './electricitegaz/electricitegaz.component';
import {GazComponent} from './gaz/gaz.component';

const routes: Routes = [
  {
    path: 'offre-electricite',
    component: ElectriciteComponent
  },
  {
    path: 'gaz-et-electricite',
    component: ElectricitegazComponent
  },
  {
    path: 'offre-gaz',
    component: GazComponent
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GazRoutingModule { }
