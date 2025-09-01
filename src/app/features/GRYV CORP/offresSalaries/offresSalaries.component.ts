import { Component, OnInit } from '@angular/core';
import { DomSanitizer, Meta, Title } from '@angular/platform-browser';
import {DecimalPipe, NgForOf} from '@angular/common';
import {ModalService} from '../../../core/services/modal.service';

@Component({
  selector: 'app-protection-financiere',
  templateUrl: './offresSalaries.component.html',
  imports: [
    DecimalPipe,
    NgForOf
  ],
  styleUrls: ['./offresSalaries.component.scss']
})
export class OffresSalariesComponent implements OnInit {

  showPdfModal: boolean = false;

  endValue = 125000; // Nombre de personnes déjà protégées
  displayedCount = 0;

  selectedProfile: string = '';

  // ✅ Offres pour les salariés uniquement
  offresSalaries = [
    {
      titre: 'PROTECTION STANDARD',
      prix: '25 EUR/mois',
      couverture: 'jusqu\'à 500 EUR/an',
      badge: 'Idéal pour débuter',
      color: 'green',
      features: [
        'Perte d\'emploi couverte',
        'Arrêt de travail inclus',
        'Paiement immédiat',
        'Sans engagement',
        'Suivi personnalisé'
      ]
    },
    {
      titre: 'PROTECTION RENFORCÉE',
      prix: '50 EUR/mois',
      couverture: 'jusqu\'à 1 500 EUR/an',
      badge: 'Notre recommandation',
      color: 'yellow',
      features: [
        'Protection maximale',
        'Couverture étendue',
        'Assistance juridique',
        'Sans engagement',
        'Support prioritaire'
      ]
    }
  ];

  constructor(
    private sanitizer: DomSanitizer,
    public modalService: ModalService,
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
    this.titleService.setTitle('GRYV - Protection Financière pour Salariés');
    this.metaService.updateTag({
      name: 'description',
      content: 'Découvrez les offres de protection financière pour salariés avec GRYV CORP. Couvrez perte d\'emploi, arrêt de travail et plus dès 25€/mois, sans engagement.'
    });
  }

  onShowModel() {
    this.modalService.showGrvvCorpModal();
  }

  onSelectProfile(profile: string) {
    this.selectedProfile = profile;
    const element = document.getElementById(`offres-${profile}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  onSubscribe(offre: any) {
    console.log('Abonnement à l\'offre:', offre);
    this.modalService.showGrvvCorpModal();
  }
}
