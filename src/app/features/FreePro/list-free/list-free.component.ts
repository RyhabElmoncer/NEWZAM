// @ts-ignore

import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import {Meta, Title} from "@angular/platform-browser";
import {UtilsService} from '../../../core/services/utils.service';
import {ApiService} from '../../../core/services/ApiService';
import {ModalService} from '../../../core/services/modal.service';

@Component({
  selector: 'app-list-free',
  templateUrl: './list-free.component.html',
  styleUrls: ['./list-free.component.scss']
})
export class ListFreeComponent {
  searchTerm = '';

  constructor(
    public activeRoute: ActivatedRoute,
    public utilsService: UtilsService,
    public modalService: ModalService,
    public apiService: ApiService,
    private titleService: Title,
    private metaService: Meta
  ) {
    this.setSEOData();
  }
// tslint:disable-next-line:typedef
  onShowModel() {
    this.modalService.showFreeModal();
  }
  private setSEOData(): void {
    this.titleService.setTitle('Free Mobile Pro : téléphonie et internet haut Débit pour entreprises');

    this.metaService.updateTag({
      name: 'description',
      content: `Avec Free Mobile Pro, bénéficiez d'une solution tout-en-un pour la communication de votre entreprise. Offrez à vos équipes un accès à des forfaits mobiles performants, sans engagement.`
    });
  }
}
