import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {StandaloneModule} from "../../shared/components/address/standalone.module";
import {SharedModule} from "../../shared/shared.module";
import {ProtectionFinanciereRoutingModule} from "./protection-financiere-routing.module";
import {MettingModalgryvcorpComponent} from "./metting-modalprotection-financiere/metting-modal.component";
import {ProtectionFinanciereComponent} from "./protection-financiere/protection-financiere.component";
import {OffresFamillesComponent} from "./offresFamilles/offresFamilles.component";
import {OffresIndependantsComponent} from "./offresIndependants/offresIndependants.component";
import {OffresSalariesComponent} from "./offresSalaries/offresSalaries.component";

@NgModule({
  declarations: [
    ProtectionFinanciereComponent,
    MettingModalgryvcorpComponent,
    OffresFamillesComponent,
    OffresIndependantsComponent,
    OffresSalariesComponent
  ],
  imports: [
    CommonModule,
    ProtectionFinanciereRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    StandaloneModule,
    SharedModule,

  ]
})
export class ProtectionFinanciereModule { }
