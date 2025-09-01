import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'pages-successfree',
  templateUrl: './page-successohm.component.html',
  styleUrls: ['./page-successohm.component.scss']
})
export class PageSuccessohmComponent implements OnInit {
  phone: string;
  email: string;
  firstName: string;
  lastName: string;
  successMessage: string;
  gatheredInfo: any;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      // Assignation directe aux propriétés de la classe
      this.phone = params['phone_number'];
      this.firstName = params['first_name'];
      this.lastName = params['last_name'];
      this.email = params['email'];

      // Initialisation de l'objet gatheredInfo
      this.gatheredInfo = {
        name: params['name'],
        phone_number: this.phone,
        first_name: this.firstName,
        last_name: this.lastName,
        email: this.email,
        address: params['address'],
        recallDate: params['recallDate'],
        recallHour: params['recallHour'],
        supplier: params['supplier'],
        isSwitchSupplier: params['isSwitchSupplier'] === 'true',
        formattedAppointment: this.formatAppointment(params['recallDate'], params['recallHour'])
      };
    });

    this.successMessage = 'Votre demande a été bien transmise';
  }

  private formatAppointment(date: string, hourId: string): string {
    if (!date || !hourId) return 'Non spécifié';

    const formattedDate = new Date(date).toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    });

    const hourText = this.getHourText(hourId);
    return `${formattedDate} ${hourText}`;
  }

  private getHourText(hourId: string): string {
    const hoursMap: { [key: string]: string } = {
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

    return hoursMap[hourId] || '';
  }
}
