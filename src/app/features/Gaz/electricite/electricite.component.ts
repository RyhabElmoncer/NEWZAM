import { Component, OnInit } from '@angular/core';
import {DomSanitizer, Meta, SafeResourceUrl, Title} from "@angular/platform-browser";
import {NgIf} from '@angular/common';
import {ModalService} from '../../../core/services/modal.service';

@Component({
  selector: 'app-electricite',
  templateUrl: './electricite.component.html',
  imports: [
    NgIf
  ],
  styleUrls: ['./electricite.component.scss']
})
export class ElectriciteComponent implements OnInit {
  endValue = 274726;
  showPdfModal: boolean = false;
  displayedCount = 0;


  constructor( private sanitizer: DomSanitizer,   public modalService: ModalService,private titleService: Title,
                  private metaService: Meta
  ) {
    this.setSEOData();


  }

  ngOnInit(): void {
    this.animateCounter();


  }
  onShowModel() {
    this.modalService.showGazModal();
  }
  openPdf(event: MouseEvent) {
    const target = event.target as HTMLElement;

    // Empêche l’ouverture si on clique sur les boutons spécifiques
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
  animateCounter(): void {
    const duration = 2000; // ms
    const frameRate = 60; // fps
    const totalFrames = Math.round((duration / 1000) * frameRate);
    let frame = 0;

    const interval = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      this.displayedCount = Math.round(this.endValue * progress);

      if (frame >= totalFrames) {
        clearInterval(interval);
        this.displayedCount = this.endValue;
      }
    }, 1000 / frameRate);


  }
  private setSEOData(): void {
    this.titleService.setTitle('Fournisseur gaz vert : offres gaz écologiques en France');

    this.metaService.updateTag({
      name: 'description',
      content: `Découvrez l'offre EXTRA ÉCO, votre fournisseur d'électricité moins cher avec -12% sur le kWh HT. Profitez de 100% d'énergie verte, produite en France, et suivez votre consommation sans engagement. Économisez tout en agissant pour la planète !.`
    });
  }
}

