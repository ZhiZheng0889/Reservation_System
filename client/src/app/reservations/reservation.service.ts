import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {
  CreateReservationRequest,
  Reservation,
} from './reservation.model';

@Injectable({
  providedIn: 'root',
})
export class ReservationService {
  private readonly http = inject(HttpClient);
  private readonly endpoint = '/reservations';

  create(request: CreateReservationRequest): Observable<number> {
    return this.http.post<number>(this.endpoint, request);
  }

  getForDate(date: string): Observable<Reservation[]> {
    const params = new HttpParams().set('date', date);

    return this.http.get<Reservation[]>(this.endpoint, { params });
  }
}
