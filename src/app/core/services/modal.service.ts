import { Injectable, ApplicationRef, ComponentFactoryResolver, Injector } from '@angular/core';
import {MettingModalComponent} from '../../shared/components/metting-modal/metting-modal.component';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  private modalRef: HTMLElement | null = null;

  constructor(
    private appRef: ApplicationRef,
    private injector: Injector,
    private cfr: ComponentFactoryResolver
  ) {}

  // Ouvrir la modale
  showMettingModal() {
    if (this.modalRef) return; // éviter les doublons

    // créer le composant MettingModalComponent
    const factory = this.cfr.resolveComponentFactory(MettingModalComponent);
    const componentRef = factory.create(this.injector);

    this.appRef.attachView(componentRef.hostView);

    // ajouter le composant au DOM
    this.modalRef = (componentRef.location.nativeElement as HTMLElement);
    document.body.appendChild(this.modalRef);

    // ajouter classe CSS pour afficher la modale
    this.modalRef.classList.add('metting-modal-open');
  }

  // Fermer la modale
  closeMettingModal() {
    if (this.modalRef) {
      document.body.removeChild(this.modalRef);
      this.modalRef = null;
    }
  }
}
