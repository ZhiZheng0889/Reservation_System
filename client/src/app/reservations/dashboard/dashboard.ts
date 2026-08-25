import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';

import { getApiErrorMessages } from '../api-error';
import { Reservation } from '../reservation.model';
import { ReservationService } from '../reservation.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly reservationService = inject(ReservationService);
  private readonly destroyRef = inject(DestroyRef);

  protected date = '';
  protected reservations: Reservation[] = [];
  protected apiErrors: string[] = [];
  protected isLoading = false;

  ngOnInit(): void {
    this.route.queryParamMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((params) => {
        const requestedDate = params.get('date');
        const date = isValidDate(requestedDate)
          ? requestedDate
          : formatLocalDate(new Date());

        if (requestedDate !== date) {
          void this.router.navigate(['/dashboard'], {
            queryParams: { date },
            replaceUrl: true,
          });
        }

        if (this.date === date) {
          return;
        }

        this.date = date;
        this.loadReservations();
      });
  }

  protected previousDay(): void {
    this.navigateTo(addDays(this.date, -1));
  }

  protected nextDay(): void {
    this.navigateTo(addDays(this.date, 1));
  }

  protected today(): void {
    this.navigateTo(formatLocalDate(new Date()));
  }

  protected displayTime(time: string): string {
    return time.slice(0, 5);
  }

  private navigateTo(date: string): void {
    void this.router.navigate(['/dashboard'], {
      queryParams: { date },
    });
  }

  private loadReservations(): void {
    this.isLoading = true;
    this.apiErrors = [];

    this.reservationService.getForDate(this.date).subscribe({
      next: (reservations) => {
        this.reservations = [...reservations].sort((left, right) =>
          left.reservation_time.localeCompare(right.reservation_time),
        );
        this.isLoading = false;
      },
      error: (error: unknown) => {
        this.reservations = [];
        this.apiErrors = getApiErrorMessages(error);
        this.isLoading = false;
      },
    });
  }
}

function addDays(date: string, amount: number): string {
  const [year, month, day] = date.split('-').map(Number);
  const result = new Date(year, month - 1, day);
  result.setDate(result.getDate() + amount);
  return formatLocalDate(result);
}

function formatLocalDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function isValidDate(value: string | null): value is string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value ?? '');

  if (!match) {
    return false;
  }

  const [, year, month, day] = match.map(Number);
  const date = new Date(year, month - 1, day);

  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}
