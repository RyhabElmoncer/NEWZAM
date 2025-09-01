// @ts-ignore

import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UtilsService } from '../../../shared/services/utils.service';
import { ModalFreeService } from '../modalFree.service';
import { ApiService } from '../../../shared/services/api.service';
import {Meta, Title} from "@angular/platform-browser";

@Component({
  selector: 'molla-list-free',
  templateUrl: './list-free.component.html',
  styleUrls: ['./list-free.component.scss']
})
export class ListFreeComponent {
  searchTerm = '';

  constructor(
    public activeRoute: ActivatedRoute,
    public utilsService: UtilsService,
    public modalService: ModalFreeService,
    public apiService: ApiService,
    private titleService: Title,
    private metaService: Meta
  ) {
    this.setSEOData();
  }
// tslint:disable-next-line:typedef
  onShowModel() {
    this.modalService.showMettingModal();
  }
  private setSEOData(): void {
    this.titleService.setTitle('Free Mobile Pro : téléphonie et internet haut Débit pour entreprises');

    this.metaService.updateTag({
      name: 'description',
      content: `Avec Free Mobile Pro, bénéficiez d'une solution tout-en-un pour la communication de votre entreprise. Offrez à vos équipes un accès à des forfaits mobiles performants, sans engagement.`
    });
  }
}
