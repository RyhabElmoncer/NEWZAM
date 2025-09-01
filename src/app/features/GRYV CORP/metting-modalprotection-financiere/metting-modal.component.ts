import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../../../shared/services/api.service';

@Component({
  selector: 'molla-metting-modal',
  templateUrl: './metting-modal.component.html',
  styleUrls: ['./metting-modal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MettingModalgryvcorpComponent implements OnInit {
  editForm2: FormGroup;
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
    });

    this.setDefaultAvailableHours();
  }

  futureDateValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;

    const inputDate = new Date(control.value);
    const today = new Date();

    inputDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    return inputDate < today ? { futureDate: true } : null;
  }

  onDateChange(event: any) {
    const date = event.target.value;
    this.fetchAvailableHours(date);
  }

  fetchAvailableHours(date: string) {
    // Implémentez votre logique API ici si nécessaire
    // Pour l'instant, on utilise les heures par défaut
    this.setDefaultAvailableHours();
  }

  setDefaultAvailableHours() {
    const defaultOptions = {
      "9": "09h - 10h",
      "10": "10h - 11h",
      "11": "11h - 12h",
      "12": "12h - 13h",
      "13": "13h - 14h",
      "14": "14h - 15h",
      "15": "15h - 16h",
      "16": "16h - 17h",
      "17": "17h - 18h",
      "18": "18h - 19h"
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
        subject: 'Nouvelle demande de rappel - GRYV CORP',
        content: emailContent,
        to: 'zoneadsl.mobile@gmail.com'
      }).toPromise();

      this.toastrService.success('Votre demande a été transmise avec succès', '', {
        timeOut: 10000,
        positionClass: 'toast-top-center',
        progressBar: true
      });

      this.router.navigate(['/pages/successgryv'], {
        queryParams: {
          phone_number: form.phone,
          first_name: form.firstName,
          last_name: form.lastName,
          email: form.email,
        }
      });

    } catch (err) {
      console.error(err);
      this.toastrService.error('Une erreur est survenue. Veuillez réessayer.', '', {
        timeOut: 10000,
        positionClass: 'toast-top-center',
        progressBar: true
      });
    } finally {
      this.isLoading = false;
    }
  }

  generateEmailContent(form: any): string {
    const date = form.recallDate ? new Date(form.recallDate).toLocaleDateString('fr-FR') : 'Non renseignée';
    const hourText = this.availableHours.find(h => h.id === form.recallHour)?.text || 'Non renseignée';

    return `
    <div style="font-family: Arial, sans-serif; color: #2c3e50; line-height: 1.6; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #1a237e; padding: 20px; text-align: center;">
        <img src="assets/images/corp.png" alt="GRYV CORP" style="max-width: 200px;">
      </div>

      <div style="padding: 30px; background-color: #f8f9fa;">
        <h2 style="color: #1a237e; margin-top: 0;">Nouvelle demande de rappel</h2>

        <p>Bonjour,</p>

        <p>Une nouvelle demande de rappel a été enregistrée via le formulaire commercial de <strong>GRYV CORP</strong>.</p>

        <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #1a237e; margin-top: 0;">Informations du client</h3>
          <p><strong>Prénom :</strong> ${form.firstName}</p>
          <p><strong>Nom :</strong> ${form.lastName}</p>
          <p><strong>Email :</strong> ${form.email}</p>
          <p><strong>Téléphone :</strong> ${form.phone}</p>
          <p><strong>Date de rappel souhaitée :</strong> ${date}</p>
          <p><strong>Créneau horaire :</strong> ${hourText}</p>
        </div>

        <p style="text-align: center; margin-top: 30px;">
          <a href="tel:${form.phone}"
             style="display: inline-block; background-color: #1a237e; color: white;
                    padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">
            Contacter le client
          </a>
        </p>
      </div>

      <div style="background-color: #e0e0e0; padding: 15px; text-align: center; font-size: 12px;">
        <p>Ce message a été envoyé automatiquement, merci de ne pas y répondre.</p>
        <p>© ${new Date().getFullYear()} GRYV CORP - Tous droits réservés</p>
      </div>
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
