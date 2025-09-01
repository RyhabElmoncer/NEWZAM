// toastr-standalone.module.ts
import { importProvidersFrom } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';

export const toastrProviders = [
  importProvidersFrom(BrowserAnimationsModule, ToastrModule.forRoot({
    positionClass: 'toast-top-right',
  }))
];
