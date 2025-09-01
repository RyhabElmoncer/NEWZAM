import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
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
export class MettingModalFreeComponent implements OnInit {
  editForm2!: FormGroup;
  isValidate = true;
  phone = '';
  recallDate = '';
  recallHour = '';
  firstName = '';   // ← Ajouter ceci
  lastName = '';    // ← Et ceci
  email = '';
  public editForm!: FormGroup;
  isAppointmentNow!: boolean;

  date = null;
  public availableHours: { id: string, text: string }[] = [];


  constructor(private fb: FormBuilder,private apiServices: ApiService , protected toastrService: ToastrService, public router: Router, private http: HttpClient) { }

  operateurs = [];

  ngOnInit(): void {
    this.isAppointmentNow = false;


    this.editForm = this.fb.group({
      phone: [null, [Validators.required, Validators.pattern(/^0[1-9][0-9]{8}$/)]],
      address: [null],
      name: [null],
      email: [null, [Validators.email]],
    });

    this.editForm2 = this.fb.group({
      phone: [null, [Validators.required, Validators.pattern('^0[1-9][0-9]{8}$')]],
      recallDate: [null, [Validators.required, this.validateFutureDate()]],
      recallHour: [null, [Validators.required]],
      name: [null], // <-- À retirer ou diviser
      lastName: [null, Validators.required],
      firstName: [null, Validators.required],
      email: [null, [Validators.email]],
      supplier: [null],
      isSwitchSupplier: [null],
      acceptation: [false, Validators.requiredTrue]
    });



  }


  // Validator to ensure the selected date is today or later
  validateFutureDate() {
    return (control: AbstractControl) => {
      const selectedDate = new Date(control.value);
      const today = new Date();

      // Set time to 00:00:00 for comparison
      if (selectedDate.setHours(0, 0, 0, 0) < today.setHours(0, 0, 0, 0)) {
        return { futureDate: true };
      }
      return null;
    };
  }

  // Called when the user changes the date
  onDateChange(event: any) {
    const selectedDate = event.target.value; // YYYY-MM-DD format
    this.fetchAvailableHours(selectedDate);
  }

  // Fetch available hours from the API based on the selected date
  fetchAvailableHours(date: string) {

    const endpoint = ``;

    this.http.get<any>(endpoint).subscribe(
      response => {
        // Check if the API returned successful data
        if (response.success && response.options) {
          this.availableHours = Object.keys(response.options).map(key => ({
            id: key,
            text: response.options[key]
          }));
        } else {
          // In case of an unsuccessful response, use the predefined hours
          this.setDefaultAvailableHours();
        }
      },
      error => {
        console.error('Error fetching available hours', error);
        // If there's an error fetching data, set the default available hours
        this.setDefaultAvailableHours();
      }
    );
  }

  // Set the default available hours if there is an error or an unsuccessful response
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



  address: string = '';
  direction: any;
  visible = "bg-success";
  phoneFix = null;
  isSwitchSupplier = null;
  supplier = null;
  name = "";


  closeModal() {
    let modal = document.querySelector('.metting-modal') as HTMLElement;
    if (modal) {
      modal.click();
    }
  }


  reservedAnAppointment() {
    if (!this.editForm2.valid) {
      this.editForm2.markAllAsTouched();
      this.toastrService.error('Veuillez accepter les conditions.', '', { timeOut: 12000 });
      return;
    }

    const form = this.editForm2.value;
    const phonePattern = /^0[1-9][0-9]{8}$/;

    if (!phonePattern.test(form.phone)) {
      this.toastrService.error('Numéro de téléphone invalide.', '', { timeOut: 12000 });
      return;
    }

    const item = {
      phone: form.phone,
      lastName: form.lastName,
      firstName: form.firstName,
      email: form.email,
      supplier: form.supplier,
      phoneFix: this.phoneFix,
      dateAppointment: `${form.recallDate} ${form.recallHour}`,
      recallHour: form.recallHour,
      isSwitchSupplier: form.isSwitchSupplier === "Oui"
    };

    const emailContent = this.generateEmailContent(form);

    this.apiServices.sendEmail({
      subject: 'Demande de rappel - Équipes Free Pro',
      content: emailContent,
      to: 'zoneadsl.mobile@gmail.com'
    }).toPromise()
      .then(() => {
        this.toastrService.success('Votre demande a été transmise', '', { timeOut: 12000 });
        this.closeModal();

        this.router.navigate(['/pages/successfree'], {
          queryParams: {
            phone_number: item.phone,
            email: item.email,
            first_name: item.firstName,
            last_name: item.lastName
          },
        });
      })
      .catch(() => {
        this.toastrService.error('Erreur lors de la réservation du rendez-vous.', '', { timeOut: 12000 });
      });
  }

  generateEmailContent(form: any): string {
    const date = form.recallDate ? new Date(form.recallDate).toLocaleDateString('fr-FR') : 'Non renseignée';
    const hourText = this.availableHours.find(h => h.id === form.recallHour)?.text || 'Non renseignée';


    return `
      <div style="font-family: Arial, sans-serif; color: #2c3e50; line-height: 1.6; font-size: 16px;">
        <p>Bonjour,</p>
        <p>
          Une nouvelle demande de rappel a été enregistrée via le formulaire commercial de <strong>Free Pro</strong>.
          Voici les informations communiquées par le client :
        </p>
        <p>
          <strong>Prénom :</strong> ${form.firstName}<br>
          <strong>Nom :</strong> ${form.lastName}<br>
          <strong>Email :</strong> ${form.email}<br>
          <strong>Téléphone :</strong> ${form.phone}<br>
          <strong>Date de rappel souhaitée :</strong> ${date}<br>
          <strong>Plage horaire préférée :</strong> ${hourText}<br>
          <
        </p>
        <p>
          Nous vous invitons à prendre contact avec ce client dans les meilleurs délais afin de répondre à sa demande.
        </p>
        <p style="margin-top: 30px;">
          Bien cordialement,<br>
          <strong>L'équipe Free Pro</strong>
        </p>
      </div>
    `;
  }
}
