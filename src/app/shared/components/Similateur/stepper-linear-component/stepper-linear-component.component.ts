import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import {ApiService} from '../../../../core/services/ApiService';
import {AddressSearchComponent} from '../../search-address/search-address.component';
import {NgIf} from '@angular/common';

interface Option {
  label: string;
  value: string;
}

interface Question {
  text: string;
  options: Option[];
  selected: string | null;
}

interface Address {
  label: string;
  street?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  houseNumber?: string;
}

interface UserInfo {
  address?: Address | null;
  fullName?: string;
  email?: string;
  phoneNumber?: string;
}

@Component({
  selector: 'app-stepper-linear-component',
  templateUrl: './stepper-linear-component.component.html',
  imports: [
    FormsModule,
    AddressSearchComponent,
    NgIf
  ],
  styleUrls: ['./stepper-linear-component.component.scss']
})
export class StepperLinearComponentComponent implements OnInit {
  selectedTab = 'box';
  isLoading = false;
  professionalUse = false;
  isValidEmailFormat = true;

  userInfo: UserInfo = {
    address: null,
    fullName: '',
    email: '',
    phoneNumber: ''
  };

  // Configuration Box Internet
  boxCurrentStep = 1;
  boxCurrentQuestion = 0;
  boxSteps: string[] = ['Vos besoins', 'Vos préférences', 'Vos informations', 'Confirmation'];
  boxQuestions: Question[][] = [
    [
      {
        text: 'Quelle offre vous intéresse ?',
        options: [
          {label: 'Navigation et emails', value: 'light'},
          {label: 'Streaming vidéo', value: 'medium'},
          {label: 'Jeux en ligne/Télétravail', value: 'heavy'}
        ],
        selected: null
      },
      {
        text: 'Quel est votre fournisseur actuel ?',
        options: [
          {label: 'Orange', value: 'orange'},
          {label: 'SFR', value: 'sfr'},
          {label: 'Free', value: 'free'},
          {label: 'Bouygues', value: 'bouygues'}
        ],
        selected: null
      }
    ],
    [
      {
        text: 'Pourquoi changer de fournisseur ?',
        options: [
          {label: 'Prix trop élevé', value: 'price'},
          {label: 'Service insatisfaisant', value: 'service'},
          {label: 'Débit insuffisant', value: 'speed'},
          {label: 'Autre raison', value: 'other'}
        ],
        selected: null
      },
      {
        text: 'Préférez-vous un engagement ?',
        options: [
          {label: '12 mois', value: '12'},
          {label: '24 mois', value: '24'},
          {label: 'Sans engagement', value: 'none'}
        ],
        selected: null
      }
    ]
  ];

  // Configuration Forfait Mobile
  mobileCurrentStep = 1;
  mobileCurrentQuestion = 0;
  mobileSteps: string[] = ['Vos besoins mobiles', 'Vos options', 'Vos informations', 'Confirmation'];
  mobileQuestions: Question[][] = [
    [
      {
        text: 'Quel est votre consommation de données ?',
        options: [
          {label: 'Moins de 5Go', value: 'low'},
          {label: '5Go à 20Go', value: 'medium'},
          {label: 'Plus de 20Go', value: 'high'}
        ],
        selected: null
      },
      {
        text: 'Combien d\'appels par mois ?',
        options: [
          {label: 'Peu d\'appels', value: 'few'},
          {label: 'Appels modérés', value: 'medium'},
          {label: 'Beaucoup d\'appels', value: 'many'}
        ],
        selected: null
      }
    ],
    [
      {
        text: 'Souhaitez-vous des SMS illimités ?',
        options: [
          {label: 'Oui', value: 'yes'},
          {label: 'Non', value: 'no'}
        ],
        selected: null
      },
      {
        text: 'Option internationale ?',
        options: [
          {label: 'Oui', value: 'yes'},
          {label: 'Non', value: 'no'}
        ],
        selected: null
      }
    ]
  ];

  constructor(
    private apiService: ApiService,
    private router: Router,
    private toastrService: ToastrService
  ) {}

  ngOnInit(): void {}

  selectTab(tab: string): void {
    this.selectedTab = tab;
    this.resetSteps();
  }

  resetSteps(): void {
    if (this.selectedTab === 'box') {
      this.boxCurrentStep = 1;
      this.boxCurrentQuestion = 0;
      this.boxQuestions.forEach(step => step.forEach(q => q.selected = null));
    } else {
      this.mobileCurrentStep = 1;
      this.mobileCurrentQuestion = 0;
      this.mobileQuestions.forEach(step => step.forEach(q => q.selected = null));
    }
    this.userInfo = {
      address: null,
      fullName: '',
      email: '',
      phoneNumber: ''
    };
  }

  // Méthodes pour Box
  selectBoxOption(question: Question, value: string): void {
    if (!question) return;
    question.selected = value;
    this.nextBoxQuestion();
  }

  nextBoxQuestion(): void {
    setTimeout(() => {
      // Étape 3 (informations personnelles)
      if (this.boxCurrentStep === 3) {
        if (this.boxCurrentQuestion < 3) { // 0=adresse, 1=nom, 2=email, 3=téléphone
          this.boxCurrentQuestion++;
        } else {
          this.boxCurrentStep++; // Passe à l'étape 4 (récapitulatif)
          this.boxCurrentQuestion = 0;
        }
      }
      // Autres étapes
      else if (this.boxCurrentStep < this.boxSteps.length) {
        const currentStepQuestions = this.boxQuestions[this.boxCurrentStep - 1];
        if (this.boxCurrentQuestion < currentStepQuestions.length - 1) {
          this.boxCurrentQuestion++;
        } else {
          this.boxCurrentStep++;
          this.boxCurrentQuestion = 0;
        }
      }
    }, 300);
  }

  previousBoxQuestion(): void {
    if (this.boxCurrentQuestion > 0) {
      this.boxCurrentQuestion--;
    } else if (this.boxCurrentStep > 1) {
      this.boxCurrentStep--;
      this.boxCurrentQuestion = this.boxQuestions[this.boxCurrentStep - 1]?.length ?
        this.boxQuestions[this.boxCurrentStep - 1].length - 1 : 0;
    }
  }
  validateEmail(): void {
    if (this.userInfo.email) {
      this.isValidEmailFormat = this.isValidEmail(this.userInfo.email);
    } else {
      this.isValidEmailFormat = true;
    }
  }

  isValidEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }
  // Méthodes pour Mobile
  selectMobileOption(question: Question, value: string): void {
    if (!question) return;
    question.selected = value;
    this.nextMobileQuestion();
  }

  nextMobileQuestion(): void {
    setTimeout(() => {
      // Étape 3 (informations personnelles)
      if (this.mobileCurrentStep === 3) {
        if (this.mobileCurrentQuestion < 3) { // 0=adresse, 1=nom, 2=email, 3=téléphone
          this.mobileCurrentQuestion++;
        } else {
          this.mobileCurrentStep++; // Passe à l'étape 4 (récapitulatif)
          this.mobileCurrentQuestion = 0;
        }
      }
      // Autres étapes
      else if (this.mobileCurrentStep < this.mobileSteps.length) {
        const currentStepQuestions = this.mobileQuestions[this.mobileCurrentStep - 1];
        if (this.mobileCurrentQuestion < currentStepQuestions.length - 1) {
          this.mobileCurrentQuestion++;
        } else {
          this.mobileCurrentStep++;
          this.mobileCurrentQuestion = 0;
        }
      }
    }, 300);
  }

  previousMobileQuestion(): void {
    if (this.mobileCurrentQuestion > 0) {
      this.mobileCurrentQuestion--;
    } else if (this.mobileCurrentStep > 1) {
      this.mobileCurrentStep--;
      this.mobileCurrentQuestion = this.mobileQuestions[this.mobileCurrentStep - 1]?.length ?
        this.mobileQuestions[this.mobileCurrentStep - 1].length - 1 : 0;
    }
  }

  handleAddressFound(address: any): void {
    try {
      console.log('Adresse brute reçue:', address);

      if (!address) {
        this.userInfo.address = null;
        return;
      }

      // Cas 1: Format avec properties (API BAN)
      if (address?.properties) {
        const props = address.properties;
        this.userInfo.address = {
          label: props.label || `${props.name || ''}, ${props.postcode || ''} ${props.city || ''}`.trim(),
          street: props.street || props.name || '',
          city: props.city || '',
          postalCode: props.postcode || '',
          country: props.country || 'France',
          houseNumber: props.housenumber || ''
        };
      }
      // Cas 2: Format simple avec champs directs
      else if (address?.street || address?.city) {
        this.userInfo.address = {
          label: address.label || `${address.street || ''}, ${address.postalCode || ''} ${address.city || ''}`.trim(),
          street: address.street || '',
          city: address.city || '',
          postalCode: address.postalCode || address.zipCode || '',
          country: address.country || 'France',
          houseNumber: address.houseNumber || ''
        };
      }
      // Cas 3: Format texte simple
      else if (typeof address === 'string') {
        this.userInfo.address = {
          label: address
        };
      }
      // Cas 4: Format inconnu mais non null
      else if (address) {
        this.userInfo.address = {
          label: address.toString()
        };
      } else {
        this.userInfo.address = null;
      }

      console.log('Adresse transformée:', this.userInfo.address);

      // Passe automatiquement à la question suivante après la sélection de l'adresse
      if (this.selectedTab === 'box') {
        this.nextBoxQuestion();
      } else {
        this.nextMobileQuestion();
      }
    } catch (error) {
      console.error('Erreur lors du traitement de l\'adresse:', error);
      this.userInfo.address = null;
    }
  }

  private isFormValid(): boolean {

    return true;
  }

  async completeBox(): Promise<void> {
    this.isLoading = true;

    if (!this.isFormValid()) {
      this.toastrService.error('Veuillez remplir tous les champs requis correctement.', '', { timeOut: 12000 });
      this.isLoading = false;
      return;
    }



    try {
      // Envoi de l'email avant la réservation
      const emailContent = this.generateEmailContent('box');
      const emailSubject = `Nouvelle simulation Box Internet - ${this.userInfo.fullName || 'Client'}`;

      await this.apiService.sendEmail({
        subject: emailSubject,
        content: emailContent,
        to: 'zoneadsl.mobile@gmail.com' // Adresse de destination
      }).toPromise();



      this.toastrService.success('Votre demande a été transmise avec succès', '', { timeOut: 12000 });

      this.resetSteps();
      this.router.navigate(['/pages/success'], {
      });

    } catch (error) {
      console.error('Erreur:', error);
      this.toastrService.error(
        'Une erreur est survenue lors du traitement de votre demande. Veuillez réessayer.',
        '',
        { timeOut: 12000 }
      );
    } finally {
      this.isLoading = false;
    }
  }

  async completeMobile(): Promise<void> {
    this.isLoading = true;

    if (!this.isFormValid()) {
      this.toastrService.error('Veuillez remplir tous les champs requis correctement.', '', { timeOut: 12000 });
      this.isLoading = false;
      return;
    }



    try {
      // Envoi de l'email avant la réservation
      const emailContent = this.generateEmailContent('mobile');
      const emailSubject = `Nouvelle simulation Forfait Mobile - ${this.userInfo.fullName || 'Client'}`;

      await this.apiService.sendEmail({
        subject: emailSubject,
        content: emailContent,
        to: 'zoneadsl.mobile@gmail.com' // Adresse de destination
      }).toPromise();



      this.toastrService.success('Votre demande a été transmise avec succès', '', { timeOut: 12000 });

      this.resetSteps();
      this.router.navigate(['/pages/success'], {

      });

    } catch (error) {
      console.error('Erreur:', error);
      this.toastrService.error(
        'Une erreur est survenue lors du traitement de votre demande. Veuillez réessayer.',
        '',
        { timeOut: 12000 }
      );
    } finally {
      this.isLoading = false;
    }
  }

  private generateEmailContent(type: 'box' | 'mobile'): string {
    const questions = type === 'box' ? this.boxQuestions : this.mobileQuestions;
    const title = type === 'box' ? 'Box Internet' : 'Forfait Mobile';

    let htmlContent = `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin-bottom: 20px; }
          h2 { color: #2c3e50; margin-top: 0; }
          .section { margin-bottom: 25px; }
          .question { margin-bottom: 15px; border-bottom: 1px solid #eee; padding-bottom: 10px; }
          .question-text { font-weight: bold; color: #2c3e50; }
          .answer { margin-left: 10px; color: #3498db; }
          .user-info { background: #f8f9fa; padding: 15px; border-radius: 5px; }
          .info-item { margin-bottom: 8px; }
          .label { font-weight: bold; display: inline-block; width: 120px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>Nouvelle simulation ${title}</h2>
            <p>Date: ${new Date().toLocaleString()}</p>
          </div>

          <div class="section">
            <h3>Détails de la simulation</h3>
  `;

    // Ajouter les questions/réponses
    questions.forEach((step, stepIndex) => {
      step.forEach(question => {
        htmlContent += `
        <div class="question">
          <div class="question-text">${question.text}</div>
          <div class="answer">${this.getQuestionLabel(question) || 'Non renseigné'}</div>
        </div>
      `;
      });
    });

    // Ajouter les infos utilisateur
    htmlContent += `
          </div>

          <div class="section user-info">
            <h3>Informations client</h3>
            <div class="info-item"><span class="label">Nom complet:</span> ${this.userInfo.fullName || 'Non renseigné'}</div>
            <div class="info-item"><span class="label">Email:</span> ${this.userInfo.email || 'Non renseigné'}</div>
            <div class="info-item"><span class="label">Téléphone:</span> ${this.userInfo.phoneNumber || 'Non renseigné'}</div>
            <div class="info-item"><span class="label">Adresse:</span> ${this.userInfo.address?.label || 'Non renseignée'}</div>
          </div>
        </div>
      </body>
    </html>
  `;

    return htmlContent;
  }
  private transformBoxAnswers(): any {
    return {
      offre: this.getSelectedOption(this.boxQuestions[0][0]),
      fournisseurActuel: this.getSelectedOption(this.boxQuestions[0][1]),
      raisonChangement: this.getSelectedOption(this.boxQuestions[1][0]),
      engagement: this.getSelectedOption(this.boxQuestions[1][1])
    };
  }

  private transformMobileAnswers(): any {
    return {
      consommationData: this.getSelectedOption(this.mobileQuestions[0][0]),
      appelsMois: this.getSelectedOption(this.mobileQuestions[0][1]),
      smsIllimites: this.getSelectedOption(this.mobileQuestions[1][0]),
      optionInternationale: this.getSelectedOption(this.mobileQuestions[1][1])
    };
  }

  private getSelectedOption(question: Question): string | null {
    return question?.selected ?
      question.options.find(opt => opt.value === question.selected)?.label || question.selected
      : null;
  }

  getQuestionLabel(question: Question): string {
    return question?.selected
      ? question.options.find(o => o.value === question.selected)?.label || 'Non renseigné'
      : 'Non renseigné';
  }
  validatePhoneNumber(): void {
    if (this.userInfo.phoneNumber) {
      this.userInfo.phoneNumber = this.userInfo.phoneNumber.replace(/\D/g, '').slice(0, 10);
    }
  }

  canGoToNextBoxQuestion(): boolean {
    if (this.boxCurrentStep === 1 || this.boxCurrentStep === 2) {
      const currentQuestion = this.boxQuestions[this.boxCurrentStep - 1][this.boxCurrentQuestion];
      return currentQuestion?.selected !== null;
    } else if (this.boxCurrentStep === 3) {
      if (this.boxCurrentQuestion === 0) return !!this.userInfo.address;
      if (this.boxCurrentQuestion === 1) return !!this.userInfo.fullName?.trim();
      if (this.boxCurrentQuestion === 2) return !!this.userInfo.email?.trim();
      if (this.boxCurrentQuestion === 3) return this.userInfo.phoneNumber?.length === 10;
    }
    return false;
  }

  canGoToNextMobileQuestion(): boolean {
    if (this.mobileCurrentStep === 1 || this.mobileCurrentStep === 2) {
      const currentQuestion = this.mobileQuestions[this.mobileCurrentStep - 1][this.mobileCurrentQuestion];
      return currentQuestion?.selected !== null;
    } else if (this.mobileCurrentStep === 3) {
      if (this.mobileCurrentQuestion === 0) return !!this.userInfo.address;
      if (this.mobileCurrentQuestion === 1) return !!this.userInfo.fullName?.trim();
      if (this.mobileCurrentQuestion === 2) return !!this.userInfo.email?.trim();
      if (this.mobileCurrentQuestion === 3) return this.userInfo.phoneNumber?.length === 10;
    }
    return false;
  }
}
