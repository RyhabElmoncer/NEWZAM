import { Component, OnInit } from '@angular/core';

import {DomSanitizer, Meta, Title} from "@angular/platform-browser";
import {ModalService} from '../../../core/services/modal.service';

@Component({
  selector: 'app-electricitegaz',
  templateUrl: './electricitegaz.component.html',
  styleUrls: ['./electricitegaz.component.scss']
})
export class ElectricitegazComponent implements  OnInit {

  showPdfModal: boolean = false;

  endValue = 274726;
  displayedCount = 0;

  constructor(  private sanitizer: DomSanitizer,   public modalService: ModalService,private titleService: Title,
                  private metaService: Meta
  ) {
    this.setSEOData();

  }
  ngOnInit(): void {
    this.animateCounter();
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
    this.titleService.setTitle('Comparateur gaz et électricité: trouvez fournisseur le moins cher\n');

    this.metaService.updateTag({
      name: 'description',
      content: ` Comparez les offres combinées électricité et gaz des principaux fournisseurs. Profitez de remises exclusives, d’un seul contrat et d’un seul interlocuteur pour vos énergies.`
    });
  }
  onShowModel() {
    this.modalService.showGazModal();
  }
  openPdfModal() {
    window.open('assets/pdf/book.pdf', '_blank');
  }

  closePdfModal() {
    this.showPdfModal = false;
  }
}
