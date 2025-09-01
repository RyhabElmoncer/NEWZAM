import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {BehaviorSubject, catchError, Observable, of} from 'rxjs';

import { environment } from '../../../environments/environment';
import {AddressAPIResult} from './AddressService';
import {map, shareReplay} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  protected _uri = 'https://api-adresse.data.gouv.fr';



  constructor(private http: HttpClient) {}
  public setBaseUri(uri: string) {
    this._uri = uri;
  }
  public fetchTypeBoxInternetData(): Observable<any> {
    return this.http.get(`${environment.SERVER_URL_2}api/public/typesService/box-internet`);
  }
  public fetchTypePhonetData(): Observable<any> {
    return this.http.get(`${environment.SERVER_URL_2}api/public/typesService/phone-plan`);
  }
    public fetchSuppliersData(): Observable<any> {
    return this.http.get(`${environment.SERVER_URL_2}api/public/suppliers`).pipe(
    );
  }
  public searchFrontOfficeNews(req?: any, item?: any): Observable<any> {
    const options = this.createRequestOption(req);
    return this.http.post(`${environment.SERVER_URL_2}api/public/news/searchFrontOffice`, item, { params: options, observe: 'response' });
  }
  public fetchPubData(): Observable<any> {

    return this.http.get(`${environment.SERVER_URL_2}api/public/licite-zoneAdsl`);
  }
  createRequestOption = (req?: any): HttpParams => {
    let options: HttpParams = new HttpParams();
    if (req) {
      Object.keys(req).forEach(key => {
        if (key !== 'sort') {
          options = options.set(key, req[key]);
        }
      });
      if (req.sort) {
        req.sort.forEach((val: string) => {
          options = options.append('sort', val);
        });
      }
    }
    return options;
  };
  public fetchNewsData(req?: any): Observable<any> {
    const options = this.createRequestOption(req);
    return this.http.get(`${environment.SERVER_URL_2}api/public/news`, { params: options, observe: 'response' });
  }
  public fetchSlidesData(): Observable<any> {

    return this.http.get(`${environment.SERVER_URL_2}api/public/slides`);
  }
  public fetchBoxPubsData(): Observable<any> {

    return this.http.get(`${environment.SERVER_URL_2}api/public/box-internets-pubs`);
  }
  public fetchPhonePlansPubsData(): Observable<any> {

    return this.http.get(`${environment.SERVER_URL_2}api/public/phone-plans-pubs`);
  }
  public fetchPhoneSideData(): Observable<any> {

    return this.http.get(`${environment.SERVER_URL_2}api/public/phone-plans-side-bar`);
  }
  public fetchBoxSideData(): Observable<any> {

    return this.http.get(`${environment.SERVER_URL_2}api/public/box-internets-side-bar`);
  }
  public reservedAnAppointmentNow(item: any): Observable<any> {
    return this.http.post(`${environment.SERVER_URL_2}api/public/reservedAnAppointmentNow`, item);
  }

  public reservedAnAppointment(item: any): Observable<any> {
    return this.http.post(`${environment.SERVER_URL_2}api/public/reservedAnAppointment`, item);
  }
  public getAddress(address: string): Observable<AddressAPIResult[]> {
    const options = {
      params: new HttpParams().set('autocomplete', '0').set('limit', '5'),
      headers: new HttpHeaders().set('Accept', 'application/json'),
    };

    if (!address) {
      // Si pas de texte, renvoyer un observable vide
      return new BehaviorSubject<AddressAPIResult[]>([]).asObservable();
    }

    options.params = options.params.set('q', address);

    return this.http.get<{ features: AddressAPIResult[] }>(`${this._uri}/search/`, options)
      .pipe(
        map(data => data.features),
        shareReplay(1)
      );
  }
  sendEmail(data: { subject: string; content: string; to?: string }): Observable<any> {
    const params = new HttpParams()
      .set('subject', data.subject)
      .set('to', data.to || 'zoneadsl.mobile@gmail.com');

    return this.http.post(
      `${environment.SERVER_URL_2}public/api/email/send-email`,
      data.content,
      {
        params,
        headers: {
          'Content-Type': 'text/html',
          'Accept': 'application/json'
        },
        responseType: 'text' // Important pour éviter les erreurs de parsing
      }
    );
  }
  searchOptimalAddress(query: string): Observable<any> {
    const encodedQuery = encodeURIComponent(query.trim());
    if (!encodedQuery) return of([]);

    return this.http.get<any[]>(`https://monreseaumobile.arcep.fr/api/search_optimal/?filter=${encodedQuery}&category=territoire`).pipe(
      map((response: any[]) => {
        // Filtrer les résultats invalides
        return response
          .filter((item: any) =>
            item.properties &&
            item.properties.post_code &&
            item.properties.city
          )
          .map((item: any) => ({
            ...item,
            properties: {
              ...item.properties,
              label: this.formatAddressLabel(item.properties)
            }
          }));
      }),
      catchError(error => {
        console.error('Erreur API ARCEP:', error);
        return of([]);
      })
    );
  }
  private formatAddressLabel(properties: any): string {
    const parts = [
      properties.housenumber,
      properties.nom,
      properties.post_code,
      properties.city
    ].filter(part => part);
    return parts.join(' ');
  }
}
