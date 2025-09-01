import { Routes } from '@angular/router';
import {AcceuilComponent} from './features/acceuil/acceuil.component';
import {ActualitesComponent} from './features/actualites/actualites.component';

export const routes: Routes = [
  { path: '', component: AcceuilComponent, pathMatch: 'full' },
  { path: 'actualites', component: ActualitesComponent, pathMatch: 'full' },

];
