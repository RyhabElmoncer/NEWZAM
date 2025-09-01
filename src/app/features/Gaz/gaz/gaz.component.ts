import { Component, OnInit } from '@angular/core';
import {DomSanitizer, Meta, Title} from "@angular/platform-browser";
import {ModalService} from '../../../core/services/modal.service';

@Component({
  selector: 'app-gaz',
  templateUrl: './gaz.component.html',
  styleUrls: ['./gaz.component.scss']
})
export class GazComponent implements OnInit {
  showPdfModal: boolean = false;
  displayedCount = 0;

  constructor(  private sanitizer: DomSanitizer,   public modalService: ModalService,private titleService: Title,
                  private metaService: Meta
  ) {
    this.setSEOData();

  }

  ngOnInit(): void {
  }
  openPdfModal() {
    this.showPdfModal = true;
  }
  openBorPdf(event: MouseEvent) {
    const target = event.target as HTMLElement;

    // Ignore le clic si l'utilisateur clique sur un bouton ou un lien
    if (
      target.closest('.call-button') ||
      target.closest('.primary-button')
    ) {
      return;
    }

    window.open('assets/pdf/2.pdf', '_blank');
  }

  closePdfModal() {
    this.showPdfModal = false;
  }
  onShowModel() {
    this.modalService.showGazModal();
  }
  private setSEOData(): void {
    this.titleService.setTitle('Fournisseur gaz vert : offres gaz écologiques en France');

    this.metaService.updateTag({
      name: 'description',
      content: ` Choisissez un fournisseur de gaz vert et économique. Découvrez nos offres écologiques en France, incluant des tarifs compétitifs, un suivi de consommation, et un engagement pour la planète.`
    });
  }
}
