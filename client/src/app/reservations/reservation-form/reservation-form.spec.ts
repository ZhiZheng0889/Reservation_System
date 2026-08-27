import { Location } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { ReservationService } from '../reservation.service';
import { ReservationForm } from './reservation-form';

describe('ReservationForm', () => {
  let fixture: ComponentFixture<ReservationForm>;
  let reservationService: { create: ReturnType<typeof vi.fn> };
  let router: { navigate: ReturnType<typeof vi.fn> };
  let location: { back: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    reservationService = { create: vi.fn() };
    router = { navigate: vi.fn().mockResolvedValue(true) };
    location = { back: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [ReservationForm],
      providers: [
        { provide: ReservationService, useValue: reservationService },
        { provide: Router, useValue: router },
        { provide: Location, useValue: location },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ReservationForm);
    fixture.detectChanges();
  });

  it('should render all required reservation fields', () => {
    const fieldNames = [
      'first_name',
      'last_name',
      'mobile_number',
      'email',
      'reservation_date',
      'reservation_time',
      'people_count',
    ];

    for (const fieldName of fieldNames) {
      const input = fixture.nativeElement.querySelector(
        `input[name="${fieldName}"]`,
      );
      expect(input).toBeTruthy();
    }
  });

  it('should not submit an invalid form', () => {
    submitForm();

    expect(reservationService.create).not.toHaveBeenCalled();
    expect(fixture.nativeElement.querySelectorAll('.is-invalid').length).toBeGreaterThan(0);
  });

  it('should save a valid reservation and navigate to its dashboard date', () => {
    reservationService.create.mockReturnValue(of(1));
    fillValidForm();

    submitForm();

    expect(reservationService.create).toHaveBeenCalledWith({
      first_name: 'Jane',
      last_name: 'Doe',
      mobile_number: '555-123-4567',
      email: 'jane@example.com',
      reservation_date: '2035-12-30',
      reservation_time: '18:30',
      people_count: 4,
    });
    expect(router.navigate).toHaveBeenCalledWith(['/dashboard'], {
      queryParams: { date: '2035-12-30' },
    });
  });

  it('should display validation errors returned by the API', () => {
    reservationService.create.mockReturnValue(
      throwError(() => ({
        error: {
          errors: {
            Email: ['Email must be a valid email address.'],
          },
        },
      })),
    );
    fillValidForm();

    submitForm();

    expect(fixture.nativeElement.textContent).toContain(
      'Email must be a valid email address.',
    );
  });

  it('should display both date errors in one alert for a past Tuesday', () => {
    fillValidForm();
    setInputValue('reservation_date', '2020-01-07');

    submitForm();

    const alerts = fixture.nativeElement.querySelectorAll('.alert.alert-danger');
    expect(alerts).toHaveLength(1);
    expect(alerts[0].textContent).toContain('Reservation date cannot be a Tuesday.');
    expect(alerts[0].textContent).toContain('Reservation date must be in the future.');
    expect(reservationService.create).not.toHaveBeenCalled();
  });

  it('should return to the previous page when cancelled', () => {
    const cancelButton = [...fixture.nativeElement.querySelectorAll('button')].find(
      (button: HTMLButtonElement) => button.textContent?.trim() === 'Cancel',
    ) as HTMLButtonElement;

    cancelButton.click();

    expect(location.back).toHaveBeenCalled();
  });

  function fillValidForm(): void {
    setInputValue('first_name', 'Jane');
    setInputValue('last_name', 'Doe');
    setInputValue('mobile_number', '555-123-4567');
    setInputValue('email', 'jane@example.com');
    setInputValue('reservation_date', '2035-12-30');
    setInputValue('reservation_time', '18:30');
    setInputValue('people_count', '4');
  }

  function setInputValue(name: string, value: string): void {
    const input = fixture.nativeElement.querySelector(
      `input[name="${name}"]`,
    ) as HTMLInputElement;
    input.value = value;
    input.dispatchEvent(new Event('input'));
  }

  function submitForm(): void {
    const form = fixture.nativeElement.querySelector('form') as HTMLFormElement;
    form.dispatchEvent(new Event('submit'));
    fixture.detectChanges();
  }
});
