import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ProtectionFinanciereComponent} from './protection-financiere/protection-financiere.component';
import {OffresFamillesComponent} from "./offresFamilles/offresFamilles.component";
import {PageSuccesgryvComponent} from "./page-successohm/page-succesgryv.component";
import {OffresSalariesComponent} from "./offresSalaries/offresSalaries.component";
import {OffresIndependantsComponent} from "./offresIndependants/offresIndependants.component";

const routes: Routes = [
  {
    path: '',
    component: ProtectionFinanciereComponent
  },
  {
    path: 'offresFamilles',
    component: OffresFamillesComponent
  },
  {
    path: 'offresSalaries',
    component: OffresSalariesComponent
  },
{
    path: 'offresIndependants',
    component: OffresIndependantsComponent
  },

];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProtectionFinanciereRoutingModule { }
