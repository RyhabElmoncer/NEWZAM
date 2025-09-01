import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {UtilsService} from "../../../shared/services/utils.service";
import {ModalService} from "../../../shared/services/modal.service";
import {ApiService} from "../../../shared/services/api.service";
import {ModalFreeService} from "../modalFree.service";
import {FreeBox} from "../OfferModel";
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'molla-free-box',
  templateUrl: './free-box.component.html',
  styleUrls: ['./free-box.component.scss']
})
export class FreeBoxComponent implements OnInit {
  searchTerm = '';

  freeBox: FreeBox = {
    titre: 'Freebox Pro',
    sousTitre: 'Encore plus puissante, toujours plus PRO',
    description: 'L offre complète pour connecter votre entreprise',
    prix: '39,99 €',
    infoPrix: 'HT / mois',
    infoAdditionnelle: 'Pendant 1 an puis 49,99 € HT / mois',
    engagement: 'Sans engagement',
    imageUrl: 'assets/images/boxfree.png',
    features: [
      { name: 'Wi-Fi 7 / Wi-Fi invité'},
      { name: 'Disque Dur NVMe 1 To et stockage Cloud 200 Go ' },
      { name: 'Débits symétriques (jusqu\'à 8 Gbit/s)', },
      { name: 'Backup automatique' },
      { name: '1 Forfait Mobile Pro 150 Go'},
      { name: 'Cybersécurité Essentielle'},
      { name: '2 lignes fixes multi-lignes' },
      { name: ' support Essentiel' }
    ]
  };
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

  ngOnInit(): void {
  }
  onShowModel() {
    this.modalService.showMettingModal();
  }
  private setSEOData(): void {
    this.titleService.setTitle('Offre Freebox Pro : internet freebox professionnel sans engangement');

    this.metaService.updateTag({
      name: 'description',
      content: `Découvrez Freebox Pro, l’offre Internet professionnelle ultra-performante, sans engagement. Profitez de la fibre puissante, d’un backup 4G, d’outils de cybersécurité intégrés`
    });
  }

}
