import { Component, OnInit } from '@angular/core';
import { ModalFreeService } from "../../FreePro/modalFree.service";
import { DomSanitizer, Meta, Title } from "@angular/platform-browser";

@Component({
  selector: 'molla-protection-famille',
  templateUrl: './offresFamilles.component.html',
  styleUrls: ['./offresFamilles.component.scss']
})
export class OffresFamillesComponent implements OnInit {

  endValue = 85000; // Nombre de familles protégées
  displayedCount = 0;

  offresFamilles = [
    {
      titre: 'PROTECTION ESSENTIELLE',
      prix: '9,99 EUR/mois',
      couverture: 'jusqu\'à 300 EUR (2x/an)',
      badge: 'Prix mini',
      color: 'blue',
      features: [
        'Factures essentielles couvertes',
        'Scolarité des enfants',
        'Frais médicaux urgents',
        '2 interventions annuelles',
        'Conseiller dédié'
      ]
    },
    {
      titre: 'PROTECTION COMPLÈTE',
      prix: '19,99 EUR/mois',
      couverture: 'jusqu\'à 800 EUR/an',
      badge: 'Solution complète',
      color: 'pink',
      features: [
        'Tous frais familiaux couverts',
        'Assistance scolaire',
        'Aide aux devoirs',
        'Soutien psychologique',
        'Assistance 24/7'
      ]
    }
  ];

  constructor(
    public modalService: ModalFreeService,
    private titleService: Title,
    private metaService: Meta
  ) {
    this.setSEOData();
  }

  ngOnInit(): void {
    this.animateCounter();
  }

  animateCounter(): void {
    const duration = 2000;
    const frameRate = 60;
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
    this.titleService.setTitle('Protection Familiale GRYV - Sécurité financière pour votre foyer');
    this.metaService.updateTag({
      name: 'description',
      content: 'Offres spéciales familles dès 9,99€/mois. Couverture des frais scolaires, médicaux et essentiels. Protection immédiate sans engagement.'
    });
  }

  onShowModel() {
    this.modalService.showMettingModagryvcorp();
  }

  onSubscribe(offre: any) {
    console.log('Souscription famille:', offre);
    this.modalService.showMettingModagryvcorp();
  }
}
