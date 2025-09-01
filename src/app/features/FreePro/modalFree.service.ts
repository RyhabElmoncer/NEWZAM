import Cookie from 'js-cookie';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { NgbModalOptions, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {MettingModalFreeComponent} from "./metting-modalfreePro/metting-modal.component";
import {MettingModalgazComponent} from "../Gaz/metting-modalgaz/metting-modal.component";
import {MettingModalgryvcorpComponent} from "../GRYV CORP/metting-modalprotection-financiere/metting-modal.component";



@Injectable({
	providedIn: 'root'
})

export class ModalFreeService {
	products = [];
	timer: any;




  private modalOption6: NgbModalOptions = {
    centered: true,
    size: 'sm',
    windowClass: 'metting-modal',
    beforeDismiss: async () => {
      document.querySelector('body')?.classList.remove('modal-open');

      await new Promise((resolve) => {
        setTimeout(() => {
          resolve('success');
        }, 300)
      });

      (document.querySelector('.logo') as HTMLElement).focus({ preventScroll: true });

      return true;
    }
  }

	constructor(private modalService: NgbModal, private router: Router, private http: HttpClient) {
	}

  // Show login modal
  showMettingModal() {
    (document.querySelector('.logo') as HTMLElement).focus({ preventScroll: true });
    this.modalService.open(
      MettingModalFreeComponent,
      this.modalOption6
    )
  }
  showMettingModalgaz() {
    (document.querySelector('.logo') as HTMLElement).focus({ preventScroll: true });
    this.modalService.open(
      MettingModalgazComponent,
      this.modalOption6
    )
  }
  showMettingModagryvcorp() {
    (document.querySelector('.logo') as HTMLElement).focus({ preventScroll: true });
    this.modalService.open(
      MettingModalgryvcorpComponent,
      this.modalOption6
    )
  }


}
