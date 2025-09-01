import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
  ReactiveFormsModule
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import {ApiService} from '../../../core/services/ApiService';
import {NgClass, NgIf} from '@angular/common';

@Component({
  selector: 'molla-metting-modal',
  templateUrl: './metting-modal.component.html',
  styleUrls: ['./metting-modal.component.scss'],
  imports: [
    ReactiveFormsModule,
    NgClass,
    NgIf
  ],
  encapsulation: ViewEncapsulation.None
})
export class MettingModalgazComponent implements OnInit {
  editForm2!: FormGroup;
  isAppointmentNow = false;
  isLoading = false;
  availableHours: { id: string, text: string }[] = [];

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private toastrService: ToastrService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.editForm2 = this.fb.group({
      phone: ['', [Validators.required, Validators.pattern(/^0[1-9]\d{8}$/)]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      recallDate: ['', [Validators.required, this.futureDateValidator]],
      recallHour: ['', Validators.required],
      supplier: [''],
      isSwitchSupplier: [false],
      acceptation: [false, Validators.requiredTrue]
    });

  }

  futureDateValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;

    const inputDate = new Date(control.value);
    const today = new Date();

    // Supprimer l'heure pour comparer uniquement les dates
    inputDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    return inputDate < today ? { futureDate: true } : null;
  }

  onDateChange(event: any) {
    const date = event.target.value;
    this.fetchAvailableHours(date);
  }

  fetchAvailableHours(date: string) {
    const endpoint = ''; // 🔁 À compléter si l’API existe
    this.http.get<any>(endpoint).subscribe(
      res => {
        if (res.success && res.options) {
          this.availableHours = Object.keys(res.options).map(key => ({
            id: key,
            text: res.options[key]
          }));
        } else {
          this.setDefaultAvailableHours();
        }
      },
      err => {
        console.error(err);
        this.setDefaultAvailableHours();
      }
    );
  }

  setDefaultAvailableHours() {
    const defaultOptions: Record<string, string> = {
      "9": "entre 9h et 10h",
      "10": "entre 10h et 11h",
      "11": "entre 11h et 12h",
      "12": "entre 12h et 13h",
      "13": "entre 13h et 14h",
      "14": "entre 14h et 15h",
      "15": "entre 15h et 16h",
      "16": "entre 16h et 17h",
      "17": "entre 17h et 18h",
      "18": "entre 18h et 19h"
    };
    this.availableHours = Object.keys(defaultOptions).map(key => ({
      id: key,
      text: defaultOptions[key]
    }));
  }

  async completeMobile(): Promise<void> {
    if (this.editForm2.invalid) return;

    this.isLoading = true;

    try {
      const form = this.editForm2.value;

      const emailContent = this.generateEmailContent(form);


      await this.apiService.sendEmail({
        subject: 'Demande de rappel - Équipes Ohm Energie',
        content: emailContent,
        to: 'zoneadsl.mobile@gmail.com'
      }).toPromise();

      this.toastrService.success('Votre demande a été transmise avec succès', '', { timeOut: 10000 });

      // Navigation vers la page de succès avec les données du formulaire
      this.router.navigate(['/pages/successohm'], {
        queryParams: {
          phone_number: form.phone,
          first_name: form.firstName,
          last_name: form.lastName,
          email: form.email,
        }
      });

    } catch (err) {
      console.error(err);
      this.toastrService.error('Une erreur est survenue. Veuillez réessayer.', '', { timeOut: 10000 });
    } finally {
      this.isLoading = false;
    }
  }
  generateEmailContent(form: any): string {
    const date = form.recallDate ? new Date(form.recallDate).toLocaleDateString('fr-FR') : 'Non renseignée';
    const hourText = this.availableHours.find(h => h.id === form.recallHour)?.text || 'Non renseignée';
    const supplier = form.supplier?.trim() || 'Non renseigné';
    const switchSupplier = form.isSwitchSupplier ? 'Oui' : 'Non';

    return `
    <div style="font-family: Arial, sans-serif; color: #2c3e50; line-height: 1.6; font-size: 16px;">
      <p>Bonjour,</p>

      <p>
        Une nouvelle demande de rappel a été enregistrée via le formulaire commercial de <strong>Ohm Énergie</strong>.
        Voici les informations communiquées par le client :
      </p>

      <p>
        <strong>Prénom :</strong> ${form.firstName}<br>
        <strong>Nom :</strong> ${form.lastName}<br>
        <strong>Email :</strong> ${form.email}<br>
        <strong>Téléphone :</strong> ${form.phone}<br>
        <strong>Date de rappel souhaitée :</strong> ${date}<br>
        <strong>Plage horaire préférée :</strong> ${hourText}<br>
        <strong>Fournisseur actuel :</strong> ${supplier}<br>
        <strong>Souhaite changer de fournisseur :</strong> ${switchSupplier}
      </p>

      <p>
        Nous vous invitons à prendre contact avec ce client dans les meilleurs délais afin de répondre à sa demande.
      </p>

      <p style="margin-top: 30px;">
        Bien cordialement,<br>
        <strong>L’équipe Ohm Énergie</strong>
      </p>
    </div>
  `;
  }

  closeModal() {
    let modal = document.querySelector('.metting-modal') as HTMLElement;
    if (modal) {
      modal.click();
    }
  }



}
