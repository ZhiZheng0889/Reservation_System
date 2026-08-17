import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { CreateReservationRequest, Reservation } from './reservation.model';
import { ReservationService } from './reservation.service';

describe('ReservationService', () => {
  let service: ReservationService;
  let httpController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(ReservationService);
    httpController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpController.verify();
  });

  it('should create a reservation', () => {
    const request: CreateReservationRequest = {
      first_name: 'Jane',
      last_name: 'Doe',
      mobile_number: '555-123-4567',
      email: 'jane@example.com',
      reservation_date: '2035-12-30',
      reservation_time: '18:30',
      people_count: 4,
    };

    service.create(request).subscribe((reservationId) => {
      expect(reservationId).toBe(1);
    });

    const httpRequest = httpController.expectOne('/reservations');

    expect(httpRequest.request.method).toBe('POST');
    expect(httpRequest.request.body).toEqual(request);

    httpRequest.flush(1);
  });

  it('should retrieve reservations for one date', () => {
    const response: Reservation[] = [
      {
        reservation_id: 1,
        first_name: 'Jane',
        last_name: 'Doe',
        mobile_number: '555-123-4567',
        email: 'jane@example.com',
        reservation_date: '2035-12-30',
        reservation_time: '18:30:00',
        people_count: 4,
      },
    ];

    service.getForDate('2035-12-30').subscribe((reservations) => {
      expect(reservations).toEqual(response);
    });

    const httpRequest = httpController.expectOne(
      '/reservations?date=2035-12-30',
    );

    expect(httpRequest.request.method).toBe('GET');

    httpRequest.flush(response);
  });
});
