import { Component, ElementRef, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { Subject, ReplaySubject, Observable, fromEvent, of } from 'rxjs';
import { debounceTime, map, switchMap, tap, takeUntil, catchError } from 'rxjs/operators';

import { SpeedtestComponent } from '../../shared/components/speedtest/speedtest.component';
import { isValidPhoneNumber } from 'libphonenumber-js';
import {AddressAPIResult} from '../../core/services/AddressService';
import {ApiService} from '../../core/services/ApiService';
import {AsyncPipe, NgClass, NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-testdebit',
  standalone: true,
  imports: [SpeedtestComponent, ReactiveFormsModule, NgClass, NgIf, NgForOf, AsyncPipe],
  templateUrl: './testdebit.component.html',
  styleUrls: ['./testdebit.component.scss']
})
export class TestdebitComponent implements OnInit, AfterViewInit, OnDestroy {
  public editForm!: FormGroup;
  protected ngUnsubscribe: Subject<void> = new Subject();
  address: string | null = null;
  phone: string | null = null;
  modelAddres!: AddressAPIResult;
  boxSide: any[] = [];
  isValidate = false;

  protected selectedAddress$: ReplaySubject<AddressAPIResult> = new ReplaySubject(1);
  protected listAddresses$: Subject<AddressAPIResult[]> = new Subject();
  listAddresses: Observable<AddressAPIResult[]> = this.listAddresses$.asObservable();
  isLoading: Subject<boolean> = new Subject();

  @ViewChild('elSearchAddress', { static: false }) elSearchAddress!: ElementRef;

  constructor(
    public apiService: ApiService,
    private fb: FormBuilder,
    protected router: Router,
    protected toastrService: ToastrService,
    private meta: Meta,
    private title: Title
  ) {}

  ngOnInit(): void {
    // ✅ SEO metadata
    this.title.setTitle('Test débit internet : tester la vitesse de votre connexion');
    this.meta.updateTag({
      name: 'description',
      content: 'Effectuez un test débit internet rapide et précis pour mesurer la vitesse de votre connexion. Testez aussi votre débit WiFi et vérifiez la qualité de votre connexion internet'
    });

    // ✅ Form initialization
    this.editForm = this.fb.group({
      address: [null, [Validators.minLength(1), Validators.maxLength(200)]],
      phone: [
        null,
        [
          Validators.pattern(
            '^(?:(?:\\+|00)33[\\s.-]{0,3}(?:\\(0\\)[\\s.-]{0,3})?|0)[1-9](?:(?:[\\s.-]?\\d{2}){4}|\\d{2}(?:[\\s.-]?\\d{3}){2})$'
          )
        ]
      ]
    });

    // ✅ Data loading
    this.apiService.fetchBoxSideData().subscribe(res => {
      this.boxSide = res;
    });
  }

  ngAfterViewInit(): void {
    fromEvent<KeyboardEvent>(this.elSearchAddress.nativeElement, 'keyup')
      .pipe(
        takeUntil(this.ngUnsubscribe),
        tap(() => this.isLoading.next(true)),
        map((event: KeyboardEvent) => (event.currentTarget as HTMLInputElement).value.trim()),
        debounceTime(300),
        switchMap(query => {
          if (!query) return of([]);
          return this.apiService.searchOptimalAddress(query).pipe(
            map((response: any[]) =>
              response
                .filter(item => item.properties)
                .map(item => {
                  let label = item.properties.label_adress;
                  if (!label) {
                    const parts = [
                      item.properties.nom,
                      item.properties.housenumber,
                      item.properties.post_code ?? item.properties.postcode,
                      item.properties.city
                    ].filter(Boolean);
                    label = parts.join(' ');
                  }
                  return {
                    entite: item.entite,
                    properties: {
                      ...item.properties,
                      label
                    }
                  };
                })
            ),
            catchError(err => {
              console.error('Erreur de recherche d’adresse:', err);
              return of([]);
            })
          );
        }),
        tap(() => this.isLoading.next(false))
      )
      .subscribe((data: any[]) => {
        this.listAddresses$.next(data as AddressAPIResult[]);
      });
  }

  selectAddress(address: AddressAPIResult) {
    this.modelAddres = address;
    const displayText =
      address.properties.label_adress ||
      [address.properties.housenumber, address.properties.nom, address.properties.post_code, address.properties.city]
        .filter(Boolean)
        .join(' ');

    this.address = displayText;
    this.elSearchAddress.nativeElement.value = displayText;
    this.selectedAddress$.next(address);
    this.listAddresses$.next([]);
  }

  lancerTest() {
    if (this.address && this.phone) {
      const item = {
        phone: this.phone,
        address: this.address,
        name: 'Box Internet'
      };
      this.apiService.reservedAnAppointmentNow(item).subscribe(() => {
        this.toastrService.success('Votre demande a été transmise', '', { timeOut: 12000 });
        this.navigateToResults();
      });
    } else if (this.address) {
      this.navigateToResults();
    }
  }

  private navigateToResults() {
    const name = this.modelAddres.properties.nom || this.modelAddres.properties.label;

    this.router.navigate(['/speed-test/rechercher'], {
      queryParams: {
        searchTerm: this.address,
        name,
        addr_numero: this.modelAddres.properties.housenumber || '',
        addr_id_fantoir: this.modelAddres.properties.id,
        citycode: this.modelAddres.properties.insee_com || this.modelAddres.properties.citycode
      }
    });
  }

  validateToPhone() {
    this.isValidate = !!this.phone && isValidPhoneNumber('+33' + this.phone, 'FR');
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
