import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FreeRoutingModule} from "./Free-routing.module";
import {ListFreeComponent} from "./list-free/list-free.component";
import {FreeBoxComponent} from "./free-box/free-box.component";
import {MettingModalFreeComponent} from "./metting-modalfreePro/metting-modal.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {StandaloneModule} from "../../shared/components/address/standalone.module";
import {SharedModule} from "../../shared/shared.module";

@NgModule({
  declarations: [
    ListFreeComponent,
    FreeBoxComponent,
    MettingModalFreeComponent,

  ],
    imports: [
        CommonModule,
        FreeRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        StandaloneModule,
        SharedModule,

    ]
})
export class FreeModule { }
