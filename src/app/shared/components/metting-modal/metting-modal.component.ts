import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../../../core/services/ApiService';
import { isValidPhoneNumber } from 'libphonenumber-js';
import { AddressSearchComponent } from '../search-address/search-address.component';

@Component({
  selector: 'app-metting-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AddressSearchComponent],
  templateUrl: './metting-modal.component.html',
  styleUrls: ['./metting-modal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MettingModalComponent implements OnInit {

  editForm!: FormGroup;
  editForm2!: FormGroup;

  isAppointmentNow = true;
  isValidate = false;

  phone: string | null = null;
  phoneFix: string | null = null;
  name = '';
  email = '';
  address: string | null = null;
  address2: string | null = null;
  supplier: string | null = null;
  isSwitchSupplier: string | null = null;
  recallDate: string | null = null;
  recallHour: string | null = null;

  availableHours: { id: string, text: string }[] = [];
  operateurs: any[] = [];

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.apiService.fetchSuppliersData().subscribe(res => this.operateurs = res);
    this.setDefaultAvailableHours();

    this.editForm = this.fb.group({
      phone: [null, [Validators.required, Validators.pattern('^(0)[1-9][0-9]{8}$')]],
      name: [null],
      email: [null, [Validators.required, Validators.email]],
      address: [null]
    });

    this.editForm2 = this.fb.group({
      phone: [null, [Validators.required, Validators.pattern('^(0)[1-9][0-9]{8}$')]],
      phoneFix: [null],
      name: [null],
      email: [null, [Validators.required, Validators.email]],
      address: [null],
      supplier: [null],
      isSwitchSupplier: [null],
      recallDate: [null, Validators.required],
      recallHour: [null, Validators.required]
    });
  }

  setDefaultAvailableHours() {
    const defaultOptions: Record<string, string> = {
      '9': 'entre 9h et 10h', '10': 'entre 10h et 11h', '11': 'entre 11h et 12h',
      '12': 'entre 12h et 13h', '13': 'entre 13h et 14h', '14': 'entre 14h et 15h',
      '15': 'entre 15h et 16h', '16': 'entre 16h et 17h', '17': 'entre 17h et 18h',
      '18': 'entre 18h et 19h'
    };
    this.availableHours = Object.entries(defaultOptions).map(([id, text]) => ({ id, text }));
  }

  debugAddressFound(event: any) { this.address = event.properties.label; }
  debugAddressFound2(event: any) { this.address2 = event.properties.label; }

  closeModal() {
    const modal = document.getElementById('newsletter-popup-form');
    if(modal) modal.style.display = 'none';
  }

  validateToPhone() { this.isValidate = !!this.phone && isValidPhoneNumber('+33' + this.phone, 'FR'); }

  reservedAnAppointmentNow() {
    if (this.editForm.valid) {
      const item = { phone: this.phone, address: this.address, name: this.name, email: this.email };
      this.apiService.reservedAnAppointmentNow(item).subscribe(() => {
        this.toastr.success('Votre demande a été transmise');
        this.closeModal();
        this.router.navigate(['/pages/success'], { queryParams: item });
      });
    } else {
      this.toastr.error('Veuillez remplir correctement tous les champs obligatoires.');
    }
  }

  reservedAnAppointment() {
    if (this.editForm2.valid) {
      const item = {
        phone: this.phone, phoneFix: this.phoneFix, dateReminderAppointment: this.recallDate + ' ' + this.recallHour,
        name: this.name, email: this.email, address: this.address2, supplier: this.supplier,
        isSwitchSupplier: this.isSwitchSupplier === 'Oui'
      };
      this.apiService.reservedAnAppointment(item).subscribe(() => {
        this.toastr.success('Votre demande a été transmise');
        this.closeModal();
        this.router.navigate(['/pages/success'], { queryParams: item });
      });
    } else {
      this.toastr.error('Veuillez remplir correctement tous les champs obligatoires.');
    }
  }

}
