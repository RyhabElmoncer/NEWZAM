import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

export interface AddressAPIResult {
  geometry: AddressAPIGeometry;
  properties: AddressAPIProperties;
  type: string;
}

export interface AddressAPIProperties {
  city: string;
  citycode: string;
  context: string;
  housenumber: string;
  id: string;
  importance: number;
  label: string;
  name: string;
  postcode: string;
  score: number;
  street: string;
  type: 'housenumber' | 'street' | 'locality' | 'municipality';
  x: string;
  y: string;
}

export interface AddressAPIGeometry {
  type: 'Position' | 'Point' | 'MultiPoint' | 'LineString' | 'MultiLineString' | 'Polygon' | 'MultiPolygon' | 'GeometryCollection';
  coordinates: AddressApiGeometryCoordinates;
}

export interface AddressApiGeometryCoordinates {
  0: number;
  1: number;
}

export interface Address {
  address: {
    housenumber: string;
    street: string;
    postcode: string;
    city: string;
  };
  coordinates: {
    latitude: AddressApiGeometryCoordinates[0];
    longitude: AddressApiGeometryCoordinates[1];
  };
}

@Injectable({ providedIn: 'root' })
export class AddressService {
  protected _uri = 'https://api-adresse.data.gouv.fr';

  constructor(private http: HttpClient) {}

  /**
   * Permet de changer l'URI si tu héberges ton propre service
   */
  set uri(uri: string) {
    this._uri = uri;
  }

  get urlSearch(): string {
    return `${this._uri}/search/`;
  }

  /**
   * Méthode interne pour gérer la requête avec options
   */
  protected get(loadOptions: {
    q?: string;
    limit?: number;
    type?: AddressAPIProperties['type'];
    autocomplete?: 0 | 1;
  }): Observable<AddressAPIResult[]> {
    const options = {
      params: new HttpParams()
        .set('autocomplete', (loadOptions.autocomplete ?? 0).toString())
        .set('limit', (loadOptions.limit ?? 12).toString()),
      headers: new HttpHeaders().set('Accept', 'application/json'),
    };

    if (!loadOptions.q) {
      // Si pas de texte, renvoyer un observable vide
      return new BehaviorSubject<AddressAPIResult[]>([]).asObservable();
    }

    options.params = options.params.set('q', loadOptions.q);

    return this.http.get<{ features: AddressAPIResult[] }>(this.urlSearch, options)
      .pipe(
        map(data => data.features),
        shareReplay(1)
      );
  }

  /**
   * Recherche d'adresses avec texte, limite, type et autocomplete
   */
  search(
    text: string,
    limit = 8,
    type: AddressAPIProperties['type'] = 'housenumber',
    autocomplete: 0 | 1 = 0
  ): Observable<AddressAPIResult[]> {
    return this.get({ q: text, limit, type, autocomplete });
  }

  /**
   * Méthode simplifiée pour compatibilité avec ton composant
   */
  getAddress(address: string): Observable<AddressAPIResult[]> {
    return this.get({ q: address, limit: 5, autocomplete: 0 });
  }
}
