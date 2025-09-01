import { Component, OnInit } from '@angular/core';
import {ModalService} from '../../../../core/services/modal.service';


@Component({
  selector: 'app-votre-conseiller',
  templateUrl: './votre-conseiller.component.html',
  styleUrls: ['./votre-conseiller.component.scss']
})
export class VotreConseillerComponent implements OnInit {

  constructor( private modalService: ModalService) {        }

  ngOnInit(): void {
  }

  onShowModel() {

    this.modalService.showDynamicModal();

  }

}
