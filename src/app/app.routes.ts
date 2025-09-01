import { Routes } from '@angular/router';
import { AcceuilComponent } from './features/acceuil/acceuil.component';
import { ActualitesComponent } from './features/actualites/actualites.component';
import { ListFreeComponent } from './features/FreePro/list-free/list-free.component';
import { FreeBoxComponent } from './features/FreePro/free-box/free-box.component';
import { ElectricitegazComponent } from './features/Gaz/electricitegaz/electricitegaz.component';
import { ElectriciteComponent } from './features/Gaz/electricite/electricite.component';
import {OffresFamillesComponent} from './features/GRYV CORP/offresFamilles/offresFamilles.component';
import {OffresSalariesComponent} from './features/GRYV CORP/offresSalaries/offresSalaries.component';
import {OffresIndependantsComponent} from './features/GRYV CORP/offresIndependants/offresIndependants.component';
import {
  ProtectionFinanciereComponent
} from './features/GRYV CORP/protection-financiere/protection-financiere.component';
import {TestdebitComponent} from './features/testdebit/testdebit.component';

export const routes: Routes = [
  { path: '', component: AcceuilComponent, pathMatch: 'full' },
  { path: 'actualites', component: ActualitesComponent, pathMatch: 'full' },

  // FreePro
  { path: 'freepro', component: ListFreeComponent, pathMatch: 'full' },
  { path: 'freepro/mobile', component: ListFreeComponent, pathMatch: 'full' },
  { path: 'freepro/box', component: FreeBoxComponent, pathMatch: 'full' },

  // Gaz & Électricité
  { path: 'gaz-electricite', component: ElectricitegazComponent, pathMatch: 'full' },
  { path: 'gaz-electricite/gaz', component: ElectricitegazComponent, pathMatch: 'full' },
  { path: 'gaz-electricite/electricite', component: ElectriciteComponent, pathMatch: 'full' },

  // GRVV CORP
  { path: 'grvv-corp', component: ProtectionFinanciereComponent, pathMatch: 'full' },
  { path: 'grvv-corp/famille', component: OffresFamillesComponent, pathMatch: 'full' },
  { path: 'grvv-corp/salaries', component: OffresSalariesComponent, pathMatch: 'full' },
 { path: 'grvv-corp/independant', component: OffresIndependantsComponent, pathMatch: 'full' },
  //testdebit
 { path: 'test-debit', component: TestdebitComponent, pathMatch: 'full' },

  { path: '**', redirectTo: '', pathMatch: 'full' },
];
