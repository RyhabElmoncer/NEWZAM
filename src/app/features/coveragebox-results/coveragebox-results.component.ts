import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalService } from 'src/app/shared/services/modal.service';

interface EligibilityData {
  address: string;
  eligibility: any;
  commune: any;
  immeuble: any;
}

interface OperatorInfo {
  id: string;
  name: string;
  displayName: string;
  coverage: string;
  speed?: string;
  available: boolean;
  logo: string;
  reception?: string;
  emission?: string;
  ping?: string;
}

interface TechnologyCoverage {
  technology: string;
  icon: string;
  color: string;
  operators: OperatorInfo[];
}

@Component({
  selector: 'app-coveragebox-results',
  templateUrl: './coveragebox-results.component.html',
  styleUrls: ['./coveragebox-results.component.scss']
})
export class CoverageboxResultsComponent implements OnInit {
  coverageData: TechnologyCoverage[] = [];
  eligibilityData: EligibilityData | null = null;
  isLoading = true;
  hasError = false;
  selectedAddress = '';

  // Nouveau: état des sections collapsibles
  collapsedSections: boolean[] = [];

  technologies = [
    {
      key: 'fiber',
      name: 'Fibre Optique',
      icon: 'fas fa-wifi',
      color: '#1e40af',
      class: 'fiber'
    },
    {
      key: 'cable',
      name: 'Câble',
      icon: 'fas fa-ethernet',
      color: '#1e40af',
      class: 'cable'
    },
    {
      key: 'adsl',
      name: 'ADSL',
      icon: 'fas fa-phone',
      color: '#1e40af',
      class: 'adsl'
    }
  ];

  operators = [
    {
      id: 'orange',
      name: 'Orange',
      displayName: 'ORG',
      logo: 'assets/images/operators/20820.png',
      class: 'orange',
      route: '/box-internet/detail/8352'
    },
    {
      id: 'sfr',
      name: 'SFR',
      displayName: 'SFR',
      logo: 'assets/images/operators/20801.png',
      class: 'sfr',
      route: '/box-internet/detail/5503'
    },
    {
      id: 'free',
      name: 'Free',
      displayName: 'FREE',
      logo: 'assets/images/operators/20815.png',
      class: 'free',
      route: '/box-internet/detail/9702'
    },
    {
      id: 'bouygues',
      name: 'Bouygues Telecom',
      displayName: 'BYG',
      logo: 'assets/images/operators/20810.png',
      class: 'bouygues',
      route: '/box-internet/detail/6513'
    },
    {
      id: 'red',
      name: 'RED by SFR',
      displayName: 'RED',
      logo: 'assets/images/operators/20818.png',
      class: 'red',
      route: '/box-internet/detail/4611'
    },
    {
      id: 'sosh',
      name: 'Sosh',
      displayName: 'SOSH',
      logo: 'assets/images/operators/20816.png',
      class: 'sosh',
      route: '/box-internet/detail/3443'
    }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private modalService: ModalService
  ) {
    // Initialiser toutes les sections comme ouvertes
    this.collapsedSections = new Array(this.technologies.length).fill(false);
  }

  ngOnInit(): void {
    this.loadEligibilityData();
  }

  /**
   * Nouveau: Toggle pour ouvrir/fermer une section technologique
   */
  toggleSection(index: number): void {
    this.collapsedSections[index] = !this.collapsedSections[index];
  }

  /**
   * Nouveau: Ouvrir le simulateur pour un opérateur
   */
  openSimulator(operatorId: string): void {
    const operatorName = this.getOperatorName(operatorId);
    console.log(`Ouverture du simulateur pour ${operatorName}`);

    // Exemple d'implémentation - à adapter selon vos besoins
    const operator = this.operators.find(op => op.id === operatorId);
    if (operator) {
      // Option 1: Redirection vers une page simulateur avec paramètres
      this.router.navigate(['/simulateur'], {
        queryParams: {
          operator: operatorId,
          operatorName: operator.name,
          address: this.selectedAddress
        }
      });

      // Option 2: Ouverture d'un modal simulateur
      // this.modalService.showSimulatorModal(operatorId, this.selectedAddress);
    }
  }

  loadEligibilityData(): void {
    this.route.queryParams.subscribe(params => {
      this.selectedAddress = params['searchTerm'] || 'Adresse de test';

      if (params['eligibilityData']) {
        try {
          this.eligibilityData = JSON.parse(params['eligibilityData']);
          this.processEligibilityData(this.eligibilityData);
        } catch (error) {
          console.error('Erreur parsing eligibilityData:', error);
          this.hasError = true;
          this.loadFallbackData();
        }
      } else {
        this.loadFallbackData();
      }

      setTimeout(() => {
        this.isLoading = false;
      }, 1500);
    });
  }

  private processEligibilityData(data: EligibilityData): void {
    if (!data?.eligibility?.features) {
      this.loadFallbackData();
      return;
    }

    const features = data.eligibility.features;
    this.coverageData = this.technologies.map(tech => ({
      technology: tech.name,
      icon: tech.icon,
      color: tech.color,
      operators: this.operators.map(operator => {
        const coverage = this.extractCoverageForOperator(features, operator.id, tech.key);
        return {
          id: operator.id,
          name: operator.name,
          displayName: operator.displayName,
          coverage: coverage.status,
          speed: coverage.speed,
          available: coverage.available,
          logo: operator.logo,
          reception: this.calculateReception(coverage.speed, tech.key, coverage.available),
          emission: this.calculateEmission(coverage.speed, tech.key, coverage.available),
          ping: this.calculatePing(tech.key, coverage.available)
        };
      })
    }));

    // Réinitialiser l'état des sections collapsed
    this.collapsedSections = new Array(this.coverageData.length).fill(false);
  }

  private extractCoverageForOperator(features: any[], operatorId: string, technology: string): any {
    const feature = features.find(f =>
      f.properties &&
      f.properties.operateur === operatorId &&
      f.properties.technologie === technology
    );

    if (feature) {
      return {
        available: feature.properties.eligible === 'oui',
        status: feature.properties.eligible === 'oui' ? 'Disponible' : 'Non disponible',
        speed: feature.properties.debit_max || 'N/A'
      };
    }

    return {
      available: false,
      status: 'Données non disponibles',
      speed: 'N/A'
    };
  }

  private calculateReception(speed: string, techKey: string, available: boolean): string {
    if (!available) return 'N/A';

    const speedValue = parseInt(speed) || 0;

    switch (techKey) {
      case 'fiber':
        return speedValue >= 1000 ? '1 Gb/s+' : speedValue >= 500 ? `${speedValue} Mb/s` : `${speedValue} Mb/s`;
      case 'cable':
        return speedValue >= 200 ? `${speedValue} Mb/s` : speedValue >= 100 ? `${speedValue} Mb/s` : `${speedValue} Mb/s`;
      case 'adsl':
        return speedValue >= 10 ? `${speedValue} Mb/s` : `${speedValue} Mb/s`;
      default:
        return speed;
    }
  }

  private calculateEmission(speed: string, techKey: string, available: boolean): string {
    if (!available) return 'N/A';

    const speedValue = parseInt(speed) || 0;

    switch (techKey) {
      case 'fiber':
        return `${Math.floor(speedValue * 0.5)} Mb/s`;
      case 'cable':
        return `${Math.floor(speedValue * 0.1)} Mb/s`;
      case 'adsl':
        return speedValue >= 10 ? '1 Mb/s' : '800 Kb/s';
      default:
        return '---';
    }
  }

  private calculatePing(techKey: string, available: boolean): string {
    if (!available) return 'N/A';

    const pings = {
      'fiber': ['3ms', '4ms', '5ms'],
      'cable': ['15ms', '20ms', '25ms'],
      'adsl': ['30ms', '40ms', '50ms']
    };

    const techPings = pings[techKey as keyof typeof pings] || ['---'];
    return techPings[Math.floor(Math.random() * techPings.length)];
  }

  private loadFallbackData(): void {
    this.coverageData = [
      {
        technology: 'Fibre Optique',
        icon: 'fas fa-wifi',
        color: '#1e40af',
        operators: this.operators.map(operator => ({
          id: operator.id,
          name: operator.name,
          displayName: operator.displayName,
          coverage: 'Disponible',
          speed: 'jusqu\'à 1 Gb/s',
          available: true,
          logo: operator.logo,
          reception: ['orange', 'free'].includes(operator.id) ? '1 Gb/s' : '800 Mb/s',
          emission: ['orange', 'free'].includes(operator.id) ? '500 Mb/s' : '400 Mb/s',
          ping: ['3ms', '4ms', '5ms'][Math.floor(Math.random() * 3)]
        }))
      },
      {
        technology: 'Câble',
        icon: 'fas fa-ethernet',
        color: '#1e40af',
        operators: this.operators.map(operator => ({
          id: operator.id,
          name: operator.name,
          displayName: operator.displayName,
          coverage: operator.id === 'sosh' ? 'Non disponible' : 'Disponible',
          speed: operator.id === 'sosh' ? 'N/A' : 'jusqu\'à 400 Mb/s',
          available: operator.id !== 'sosh',
          logo: operator.logo,
          reception: operator.id === 'sosh' ? 'N/A' : '400 Mb/s',
          emission: operator.id === 'sosh' ? 'N/A' : '40 Mb/s',
          ping: operator.id === 'sosh' ? 'N/A' : '15ms'
        }))
      },
      {
        technology: 'ADSL',
        icon: 'fas fa-phone',
        color: '#1e40af',
        operators: this.operators.map(operator => ({
          id: operator.id,
          name: operator.name,
          displayName: operator.displayName,
          coverage: 'Disponible',
          speed: 'jusqu\'à 15 Mb/s',
          available: true,
          logo: operator.logo,
          reception: ['orange', 'sfr'].includes(operator.id) ? '15 Mb/s' : '12 Mb/s',
          emission: ['orange', 'sfr'].includes(operator.id) ? '1 Mb/s' : '800 Kb/s',
          ping: ['25ms', '30ms', '35ms'][Math.floor(Math.random() * 3)]
        }))
      }
    ];

    // Réinitialiser l'état des sections collapsed
    this.collapsedSections = new Array(this.coverageData.length).fill(false);
  }

  /**
   * Obtenir le nom d'un opérateur par son ID
   */
  getOperatorName(operatorId: string): string {
    const operator = this.operators.find(op => op.id === operatorId);
    return operator ? operator.name : operatorId;
  }

  /**
   * Demander un rappel pour un opérateur
   */
  requestCallBack(operatorId: string): void {
    const operatorName = this.getOperatorName(operatorId);
    console.log(`Demande de rappel pour ${operatorName}`);

    // Appel du service modal existant
    this.modalService.showMettingModal();

    // Optionnel: passer l'ID de l'opérateur au modal
    // this.modalService.showMettingModal({ operatorId, operatorName, address: this.selectedAddress });
  }

  /**
   * Voir les offres d'un opérateur
   */
  viewOffers(operatorId: string): void {
    const operator = this.operators.find(op => op.id === operatorId);
    if (operator && operator.route) {
      // Navigation vers la page des offres de l'opérateur
      this.router.navigate([operator.route]);
    } else {
      // Navigation générique si pas de route spécifique
      this.router.navigate(['/box-internet/offers'], {
        queryParams: {
          operator: operatorId,
          address: this.selectedAddress
        }
      });
    }
  }

  /**
   * Aller au comparateur d'offres
   */
  goToStepper(): void {
    this.router.navigate(['/box-internet/compa'], {
      queryParams: {
        address: this.selectedAddress,
        source: 'coverage-results'
      }
    });
  }

  /**
   * Méthodes utilitaires pour la gestion des états
   */

  /**
   * Vérifier si une section est collapsed
   */
  isSectionCollapsed(index: number): boolean {
    return this.collapsedSections[index] || false;
  }

  /**
   * Ouvrir toutes les sections
   */
  expandAllSections(): void {
    this.collapsedSections = new Array(this.coverageData.length).fill(false);
  }

  /**
   * Fermer toutes les sections
   */
  collapseAllSections(): void {
    this.collapsedSections = new Array(this.coverageData.length).fill(true);
  }

  /**
   * Compter le nombre d'opérateurs disponibles pour une technologie
   */
  getAvailableOperatorsCount(techIndex: number): number {
    if (!this.coverageData[techIndex]) return 0;
    return this.coverageData[techIndex].operators.filter(op => op.available).length;
  }

  /**
   * Obtenir le statut global d'une technologie
   */
  getTechnologyStatus(techIndex: number): 'all-available' | 'partial' | 'none' {
    if (!this.coverageData[techIndex]) return 'none';

    const operators = this.coverageData[techIndex].operators;
    const availableCount = operators.filter(op => op.available).length;

    if (availableCount === 0) return 'none';
    if (availableCount === operators.length) return 'all-available';
    return 'partial';
  }

  /**
   * Recharger les données en cas d'erreur
   */
  retryLoadData(): void {
    this.hasError = false;
    this.isLoading = true;
    this.loadEligibilityData();
  }

  /**
   * Méthodes pour les actions batch (optionnelles)
   */

  /**
   * Comparer plusieurs opérateurs sélectionnés
   */
  compareSelectedOperators(selectedOperatorIds: string[]): void {
    this.router.navigate(['/box-internet/compare'], {
      queryParams: {
        operators: selectedOperatorIds.join(','),
        address: this.selectedAddress
      }
    });
  }

  /**
   * Obtenir les meilleures offres par technologie
   */
  getBestOffersByTechnology(): void {
    this.router.navigate(['/box-internet/best-offers'], {
      queryParams: {
        address: this.selectedAddress,
        technologies: this.coverageData.map(tech => tech.technology).join(',')
      }
    });
  }

  /**
   * Exporter les résultats de couverture
   */
  exportCoverageResults(): void {
    const exportData = {
      address: this.selectedAddress,
      timestamp: new Date().toISOString(),
      coverage: this.coverageData.map(tech => ({
        technology: tech.technology,
        operators: tech.operators.map(op => ({
          name: op.name,
          available: op.available,
          reception: op.reception,
          emission: op.emission,
          ping: op.ping
        }))
      }))
    };

    // Convertir en JSON et télécharger
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `couverture-${this.selectedAddress.replace(/[^a-z0-9]/gi, '-').toLowerCase()}-${Date.now()}.json`;
    link.click();

    URL.revokeObjectURL(url);
  }

  /**
   * Lifecycle hooks et cleanup
   */
  ngOnDestroy(): void {
    // Nettoyage si nécessaire
  }
}
