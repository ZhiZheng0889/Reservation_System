import { Location } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';

import { getApiErrorMessages } from '../api-error';
import { ReservationService } from '../reservation.service';

const futureWorkingDateValidator: ValidatorFn = (
  control: AbstractControl,
): ValidationErrors | null => {
  const value = control.value as string;
  if (!value) return null;

  const parts = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!parts) return null;

  const [, year, month, day] = parts;
  const errors: ValidationErrors = {};
  const reservationDate = Date.UTC(+year, +month - 1, +day);
  const today = new Date();
  const todayDate = Date.UTC(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );

  if (new Date(reservationDate).getUTCDay() === 2) errors['closedTuesday'] = true;
  if (reservationDate <= todayDate) errors['notFuture'] = true;

  return Object.keys(errors).length > 0 ? errors : null;
};

@Component({
  selector: 'app-reservation-form',
  imports: [ReactiveFormsModule],
  templateUrl: './reservation-form.html',
  styleUrl: './reservation-form.scss',
})
export class ReservationForm {
  private readonly formBuilder = inject(FormBuilder);
  private readonly reservationService = inject(ReservationService);
  private readonly router = inject(Router);
  private readonly location = inject(Location);

  protected readonly form = this.formBuilder.nonNullable.group({
    first_name: ['', [Validators.required, Validators.maxLength(100)]],
    last_name: ['', [Validators.required, Validators.maxLength(100)]],
    mobile_number: ['', [Validators.required, Validators.maxLength(30)]],
    email: [
      '',
      [Validators.required, Validators.email, Validators.maxLength(100)],
    ],
    reservation_date: ['', [Validators.required, futureWorkingDateValidator]],
    reservation_time: ['', Validators.required],
    people_count: [1, [Validators.required, Validators.min(1)]],
  });

  protected isSubmitting = false;
  protected apiErrors: string[] = [];
  protected formErrors: string[] = [];

  protected submit(): void {
    this.apiErrors = [];
    this.formErrors = [];

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      const dateErrors = this.form.controls.reservation_date.errors;
      if (dateErrors?.['closedTuesday']) {
        this.formErrors.push('Reservation date cannot be a Tuesday.');
      }
      if (dateErrors?.['notFuture']) {
        this.formErrors.push('Reservation date must be in the future.');
      }
      return;
    }

    const request = this.form.getRawValue();
    this.isSubmitting = true;

    this.reservationService.create(request).subscribe({
      next: () => {
        void this.router.navigate(['/dashboard'], {
          queryParams: { date: request.reservation_date },
        });
      },
      error: (error: unknown) => {
        this.apiErrors = getApiErrorMessages(error);
        this.isSubmitting = false;
      },
    });
  }

  protected cancel(): void {
    this.location.back();
  }
}
