import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalService } from 'src/app/shared/services/modal.service';

@Component({
  selector: 'app-coverage-results',
  templateUrl: './coverage-results.component.html',
  styleUrls: ['./coverage-results.component.scss']
})
export class CoverageResultsComponent implements OnInit {
  coverageData: any;

  // Technologies disponibles
  technologies = ['4G', '5G'];
  selectedTechnologies = ['4G', '5G'];

  // Tous les opérateurs français (dynamiques et statiques)
  operators = [
    { id: '20820', name: 'Orange', dynamic: true },
    { id: '20815', name: 'Free', dynamic: true },
    { id: '20801', name: 'SFR', dynamic: true },
    { id: '20810', name: 'Bouygues', dynamic: true },
    { id: '20818', name: 'RED', dynamic: false },
    { id: '20816', name: 'Sosh', dynamic: false },
    { id: '20821', name: 'Lebara', dynamic: false },
    { id: '20814', name: 'NRJ Mobile', dynamic: false },
    { id: '20822', name: 'Lycamobile', dynamic: false }
  ];
  selectedOperators = this.operators.map(op => op.id);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private modalService: ModalService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['coverageData']) {
        try {
          this.coverageData = JSON.parse(params['coverageData']);
          console.log('Données de couverture:', this.coverageData);
        } catch (e) {
          console.error('Erreur de parsing des données:', e);
        }
      }
    });
  }

  getOperatorName(operatorId: string): string {
    const operator = this.operators.find(op => op.id === operatorId);
    return operator ? operator.name : operatorId;
  }

  getFilteredOperators(): string[] {
    return this.operators
      .map(op => op.id)
      .filter(id => this.selectedOperators.includes(id));
  }

  getCoverageValue(operatorId: string, technology: string): number {
    const operator = this.operators.find(op => op.id === operatorId);
    if (!operator) return 0;

    if (operator.dynamic) {
      // Comportement normal pour les opérateurs dynamiques
      const idx = this.coverageData.stat.operator.indexOf(operatorId);
      const valuesKey = `values_${technology.toLowerCase()}`;
      const values = this.coverageData.stat[valuesKey];
      return (values && values[idx] !== undefined) ? values[idx] : 0;
    } else {
      // Pour les opérateurs statiques : prendre le min des dynamiques pour la technologie demandée
      const minValue = this.getDynamicOperatorsMinValue(technology.toLowerCase());
      return minValue;
    }
  }

  getDynamicOperatorsMinValue(technology: string): number {
    if (!this.coverageData?.stat) return 0;

    const dynamicOperators = this.operators.filter(op => op.dynamic);
    let minValue = 100; // Initialiser avec le maximum possible

    dynamicOperators.forEach(operator => {
      const idx = this.coverageData.stat.operator.indexOf(operator.id);
      const valuesKey = `values_${technology.toLowerCase()}`;
      const values = this.coverageData.stat[valuesKey];

      if (values && values[idx] !== undefined) {
        minValue = Math.min(minValue, values[idx]);
      }
    });

    return minValue === 100 ? 0 : minValue;
  }

  getCircleProgress(percentage: number): string {
    const circumference = 251.33;
    const progress = (percentage / 100) * circumference;
    return `${progress} ${circumference}`;
  }

  requestCallBack(operatorId: string): void {
    const operatorName = this.getOperatorName(operatorId);
    console.log(`Demande de rappel pour ${operatorName}`);
    this.onShowModel();
  }

  onShowModel(): void {
    this.modalService.showMettingModal();
  }

  goToStepper(): void {
    this.router.navigate(['/box-internet/compa']);
  }

  // Nouvelle méthode pour naviguer vers les offres de l'opérateur
  viewOffers(operatorId: string): void {
    const operatorName = this.getOperatorName(operatorId);
    console.log(`Navigation vers les offres de ${operatorName}`);

    // Routes fixes pour chaque opérateur
    const operatorRoutes: { [key: string]: string } = {
      '20820': '/phone-plans/detail/5555',
      '20815': '/phone-plans/detail/8152',        // Free
      '20801': '/phone-plans/detail/9205',         // SFR
      '20810': '/phone-plans/detail/5753',    // Bouygues
      '20818': '/phone-plans/detail/7836',         // RED by SFR
      '20816': '/phone-plans/detail/5934',        // Sosh
      '20821': '/phone-plans/detail/3245',      // Lebara
      '20814': '/phone-plans/detail/8452',  // NRJ Mobile
      '20822': '/phone-plans/detail/4579'   // Lycamobile
    };

    const route = operatorRoutes[operatorId];

    if (route) {
      this.router.navigate([route]);
    } else {
      console.warn(`Aucune route définie pour l'opérateur ${operatorName}`);
      // Route par défaut ou gestion d'erreur
      this.router.navigate(['/offres'], { queryParams: { operator: operatorName } });
    }
  }
}
