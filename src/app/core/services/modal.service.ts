import { Injectable, ApplicationRef, ComponentFactoryResolver, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';

import { MettingModalComponent } from '../../shared/components/metting-modal/metting-modal.component';
import { MettingModalFreeComponent } from '../../features/FreePro/metting-modalfreePro/metting-modal.component';
import { MettingModalgazComponent } from '../../features/Gaz/metting-modalgaz/metting-modal.component';
import { MettingModalgryvcorpComponent } from '../../features/GRYV CORP/metting-modalprotection-financiere/metting-modal.component';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  private modalRef: HTMLElement | null = null;

  private ngbOptions: NgbModalOptions = {
    centered: true,
    size: 'sm',
    windowClass: 'metting-modal',
    beforeDismiss: async () => {
      document.querySelector('body')?.classList.remove('modal-open');
      await new Promise(resolve => setTimeout(() => resolve('success'), 300));
      (document.querySelector('.logo') as HTMLElement).focus({ preventScroll: true });
      return true;
    }
  };

  constructor(
    private appRef: ApplicationRef,
    private injector: Injector,
    private cfr: ComponentFactoryResolver,
    private modalService: NgbModal,
    private router: Router,
    private http: HttpClient
  ) {}

  // ---------------------
  // Approche dynamique
  // ---------------------
  showDynamicModal() {
    if (this.modalRef) return;

    const factory = this.cfr.resolveComponentFactory(MettingModalComponent);
    const componentRef = factory.create(this.injector);

    this.appRef.attachView(componentRef.hostView);

    this.modalRef = componentRef.location.nativeElement as HTMLElement;
    document.body.appendChild(this.modalRef);
    this.modalRef.classList.add('metting-modal-open');
  }

  closeDynamicModal() {
    if (this.modalRef) {
      document.body.removeChild(this.modalRef);
      this.modalRef = null;
    }
  }

  // ---------------------
  // Approche NgbModal
  // ---------------------
  showFreeModal() {
    (document.querySelector('.logo') as HTMLElement).focus({ preventScroll: true });
    this.modalService.open(MettingModalFreeComponent, this.ngbOptions);
  }

  showGazModal() {
    (document.querySelector('.logo') as HTMLElement).focus({ preventScroll: true });
    this.modalService.open(MettingModalgazComponent, this.ngbOptions);
  }

  showGrvvCorpModal() {
    (document.querySelector('.logo') as HTMLElement).focus({ preventScroll: true });
    this.modalService.open(MettingModalgryvcorpComponent, this.ngbOptions);
  }
}
