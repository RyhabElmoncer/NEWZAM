import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'pages-successfree',
  templateUrl: './page-successfree.component.html',
  styleUrls: ['./page-successfree.component.scss']
})
export class PageSuccessfreeComponent implements OnInit {
  phone!: string;
  email!: string;
  firstName!: string;
  lastName!: string;
  successMessage!: string;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.phone = params['phone_number'];
      this.email = params['email'];
      this.firstName = params['first_name'];
      this.lastName = params['last_name'];
    });
    this.successMessage = 'Votre demande a été bien transmise';

  }
}
