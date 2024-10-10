import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GeocodingService {

  private nominatimUrl = 'https://nominatim.openstreetmap.org/search';

  constructor(private http: HttpClient) { }

  geocodeAddress(address: string): Observable<any> {
    return this.http.get<any>(`${this.nominatimUrl}?q=${encodeURIComponent(address)}&format=json&addressdetails=1&limit=1`);
  }
}
