import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ListFreeComponent} from "./list-free/list-free.component";
import {FreeBoxComponent} from "./free-box/free-box.component";

const routes: Routes = [
  {
    path: 'Freemobile',
    component: ListFreeComponent
  },
  {
    path: 'FreeBox',
    component: FreeBoxComponent
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FreeRoutingModule { }
