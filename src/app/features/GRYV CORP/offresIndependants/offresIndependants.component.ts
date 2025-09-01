import { Component, OnInit } from '@angular/core';
import { DomSanitizer, Meta, Title } from '@angular/platform-browser';
import { ModalFreeService } from '../../FreePro/modalFree.service';

@Component({
  selector: 'molla-protection-independants',
  templateUrl: './offresIndependants.component.html',
  styleUrls: ['./offresIndependants.component.scss']
})
export class OffresIndependantsComponent implements OnInit {

  showPdfModal: boolean = false;
  pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl('assets/pdf/gryv-guide.pdf');

  endValue = 125000; // Nombre de personnes déjà protégées
  displayedCount = 0;

  // Offres pour les indépendants uniquement
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
    private titleService: Title,
    private metaService: Meta,
    public modalService: ModalFreeService
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
    this.titleService.setTitle('Protection Indépendants - Sécurité financière pour professionnels');
    this.metaService.updateTag({
      name: 'description',
      content: 'Découvrez les protections GRYV pour indépendants. Sécurisez votre activité avec des offres adaptées, dès 29,99€/mois. Sans engagement.'
    });
  }

  onShowModel(): void {
    this.modalService.showMettingModagryvcorp();
  }

  onSubscribe(offre: any): void {
    console.log('Abonnement à l\'offre:', offre);
    this.modalService.showMettingModagryvcorp();
  }

}
