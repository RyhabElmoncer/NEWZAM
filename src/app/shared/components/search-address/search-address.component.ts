import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { fromEvent, Observable, Subject } from 'rxjs';
import { debounceTime, filter, map, switchMap, takeUntil } from 'rxjs/operators';
import { ApiService } from '../../../core/services/ApiService';
import {AddressAPIResult} from '../../../core/services/AddressService';

@Component({
  selector: 'app-search-address',
  standalone: true,
  imports: [CommonModule],
  template: `
    <label *ngIf="label" [for]="id">{{ label }}</label>
    <input #elSearchAddress
           [id]="id"
           class="form-control"
           [placeholder]="placeholder || 'Entrez votre adresse domicile'"/>

    <div *ngIf="listAddresses | async as addresses" class="results">
      <ul>
        <li *ngFor="let address of addresses" (click)="selectAddress(address)">
          <i class="icon-map-marker"></i> {{ address.properties.label }}
        </li>
      </ul>
    </div>
  `,
  styleUrls: ['./search-address.component.scss']
})
export class AddressSearchComponent implements OnInit, AfterViewInit, OnDestroy {

  constructor(public api: ApiService) {}

  @Input() placeholder = '';
  @Input() label = '';
  @Input() id = 'ri-address-search-' + Date.now();
  @Input() uri?: string;

  @ViewChild('elSearchAddress', { static: true }) elSearchAddress!: ElementRef;

  @Output() addressFound = new EventEmitter<AddressAPIResult>();

  private listAddresses$ = new Subject<AddressAPIResult[]>();
  listAddresses: Observable<AddressAPIResult[]> = this.listAddresses$.asObservable();

  private ngUnsubscribe = new Subject<void>();

  ngOnInit(): void {
    if (this.uri) {
      this.api['_uri'] = this.uri; // Permet de changer la base URI si nécessaire
    }
  }

  ngAfterViewInit(): void {
    fromEvent<KeyboardEvent>(this.elSearchAddress.nativeElement, 'keyup')
      .pipe(
        map(event => (event.target as HTMLInputElement).value),
        debounceTime(500),
        filter(value => value.length > 2),
        switchMap(value => this.api.getAddress(value)),
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe((results: AddressAPIResult[]) => {
        this.listAddresses$.next(results || []);
      });
  }

  selectAddress(address: AddressAPIResult) {
    this.elSearchAddress.nativeElement.value = address.properties.label;
    this.addressFound.emit(address);
    this.listAddresses$.next([]); // vider la liste après sélection
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
