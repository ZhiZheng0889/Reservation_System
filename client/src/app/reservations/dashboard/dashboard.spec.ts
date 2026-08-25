import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';
import { BehaviorSubject, of, throwError } from 'rxjs';

import { Reservation } from '../reservation.model';
import { ReservationService } from '../reservation.service';
import { Dashboard } from './dashboard';

describe('Dashboard', () => {
  let fixture: ComponentFixture<Dashboard>;
  let queryParams: BehaviorSubject<ReturnType<typeof convertToParamMap>>;
  let reservationService: { getForDate: ReturnType<typeof vi.fn> };
  let router: { navigate: ReturnType<typeof vi.fn> };

  const reservations: Reservation[] = [
    {
      reservation_id: 2,
      first_name: 'Late',
      last_name: 'Guest',
      mobile_number: '555-2222',
      email: 'late@example.com',
      reservation_date: '2035-12-30',
      reservation_time: '20:00:00',
      people_count: 2,
    },
    {
      reservation_id: 1,
      first_name: 'Early',
      last_name: 'Guest',
      mobile_number: '555-1111',
      email: 'early@example.com',
      reservation_date: '2035-12-30',
      reservation_time: '18:00:00',
      people_count: 4,
    },
  ];

  beforeEach(async () => {
    queryParams = new BehaviorSubject(convertToParamMap({ date: '2035-12-30' }));
    reservationService = { getForDate: vi.fn().mockReturnValue(of(reservations)) };
    router = { navigate: vi.fn().mockResolvedValue(true) };

    await TestBed.configureTestingModule({
      imports: [Dashboard],
      providers: [
        { provide: ActivatedRoute, useValue: { queryParamMap: queryParams } },
        { provide: ReservationService, useValue: reservationService },
        { provide: Router, useValue: router },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Dashboard);
    fixture.detectChanges();
  });

  it('should load reservations for the query-string date in time order', () => {
    expect(reservationService.getForDate).toHaveBeenCalledWith('2035-12-30');

    const rows = fixture.nativeElement.querySelectorAll('tbody tr');
    expect(rows.length).toBe(2);
    expect(rows[0].textContent).toContain('Early Guest');
    expect(rows[1].textContent).toContain('Late Guest');
  });

  it('should navigate to the previous and next dates', () => {
    clickButton('Previous');
    expect(router.navigate).toHaveBeenCalledWith(['/dashboard'], {
      queryParams: { date: '2035-12-29' },
    });

    clickButton('Next');
    expect(router.navigate).toHaveBeenCalledWith(['/dashboard'], {
      queryParams: { date: '2035-12-31' },
    });
  });

  it('should navigate to today', () => {
    clickButton('Today');

    const expectedDate = formatLocalDate(new Date());
    expect(router.navigate).toHaveBeenCalledWith(['/dashboard'], {
      queryParams: { date: expectedDate },
    });
  });

  it('should default a missing date to today', () => {
    queryParams.next(convertToParamMap({}));
    fixture.detectChanges();

    const expectedDate = formatLocalDate(new Date());
    expect(reservationService.getForDate).toHaveBeenCalledWith(expectedDate);
    expect(router.navigate).toHaveBeenCalledWith(['/dashboard'], {
      queryParams: { date: expectedDate },
      replaceUrl: true,
    });
  });

  it('should display API errors', () => {
    fixture.destroy();
    reservationService.getForDate.mockReturnValue(
      throwError(() => ({ error: { detail: 'Unable to load reservations.' } })),
    );

    fixture = TestBed.createComponent(Dashboard);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain(
      'Unable to load reservations.',
    );
  });

  function clickButton(label: string): void {
    const button = [...fixture.nativeElement.querySelectorAll('button')].find(
      (candidate: HTMLButtonElement) => candidate.textContent?.trim() === label,
    ) as HTMLButtonElement;
    button.click();
  }
});

function formatLocalDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
