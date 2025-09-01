import { Component, OnInit } from '@angular/core';
import { ModalFreeService } from "../../FreePro/modalFree.service";
import { ActivatedRoute } from "@angular/router";
import { UtilsService } from "../../../shared/services/utils.service";
import { ApiService } from "../../../shared/services/api.service";
import { DomSanitizer, Meta, Title } from "@angular/platform-browser";

@Component({
  selector: 'molla-protection-financiere',
  templateUrl: './protection-financiere.component.html',
  styleUrls: ['./protection-financiere.component.scss']
})
export class ProtectionFinanciereComponent implements OnInit {

  showPdfModal: boolean = false;
  pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl('assets/pdf/gryv-guide.pdf');

  endValue = 125000; // Nombre de personnes déjà protégées
  displayedCount = 0;

  selectedProfile: string = '';

  // Données des offres
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

  offresFamilles = [
    {
      titre: 'PROTECTION ESSENTIELLE',
      prix: '9,99 EUR/mois',
      couverture: 'jusqu\'à 300 EUR (2x/an)',
      badge: 'Prix mini',
      color: 'blue',
      features: [
        'Factures essentielles',
        'Activation rapide',
        'Deux interventions par an',
        'Sans engagement',
        'Conseiller dédié'
      ]
    },
    {
      titre: 'PROTECTION COMPLÈTE',
      prix: '19,99 EUR/mois',
      couverture: 'jusqu\'à 800 EUR/an',
      badge: 'Meilleur rapport qualité/prix',
      color: 'pink',
      features: [
        'Couverture optimale',
        'Tous types de factures',
        'Accompagnement complet',
        'Sans engagement',
        'Assistance 24/7'
      ]
    }
  ];

  offresIndependants = [
    {
      titre: 'PROTECTION ACTIVITÉ',
      prix: '29,99 EUR/mois',
      couverture: '60% du CA moyen',
      badge: 'Spécial indépendants',
      color: 'purple',
      features: [
        'Baisse d\'activité couverte',
        'Incapacité temporaire',
        'Versement rapide',
        'Sans engagement',
        'Expertise métier'
      ]
    },
    {
      titre: 'PROTECTION MAXIMALE',
      prix: '39,99 EUR/mois',
      couverture: '80% du CA moyen',
      badge: 'Couverture maximale',
      color: 'red',
      features: [
        'Protection complète',
        'Tous risques couverts',
        'Accompagnement expert',
        'Sans engagement',
        'Garantie satisfaction'
      ]
    }
  ];

  constructor(
    private sanitizer: DomSanitizer,
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
    this.titleService.setTitle('Assurance perte d\'emploi : protection chômage par GRYV CORP');
    this.metaService.updateTag({
      name: 'description',
      content: 'GRYV CORP vous couvre en cas de perte d\'emploi ou arrêt maladie. Une assurance souple, rapide et accessible dès 9,99€/mois.'
    });
  }

  onShowModel() {
    this.modalService.showMettingModagryvcorp();
  }

  onSelectProfile(profile: string) {
    this.selectedProfile = profile;
    // Scroll vers les offres correspondantes
    const element = document.getElementById(`offres-${profile}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  onSubscribe(offre: any) {
    // Logique d'abonnement
    console.log('Abonnement à l\'offre:', offre);
    this.modalService.showMettingModagryvcorp();
  }




}
