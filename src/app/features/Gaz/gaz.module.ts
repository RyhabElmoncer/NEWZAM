import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {StandaloneModule} from "../../shared/components/address/standalone.module";
import {SharedModule} from "../../shared/shared.module";
import {GazRoutingModule} from "./gaz-routing.module";
import {GazComponent} from "./gaz/gaz.component";
import {ElectricitegazComponent} from "./electricitegaz/electricitegaz.component";
import {ElectriciteComponent} from "./electricite/electricite.component";
import {MettingModalgazComponent} from "./metting-modalgaz/metting-modal.component";

@NgModule({
  declarations: [
    GazComponent,
    ElectricitegazComponent,
    ElectriciteComponent,
    MettingModalgazComponent
  ],
  imports: [
    CommonModule,
    GazRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    StandaloneModule,
    SharedModule,

  ]
})
export class GazModule { }
