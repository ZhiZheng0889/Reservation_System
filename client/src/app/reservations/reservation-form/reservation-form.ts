import { Location } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';

import { getApiErrorMessages } from '../api-error';
import { ReservationService } from '../reservation.service';

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
    reservation_date: ['', Validators.required],
    reservation_time: ['', Validators.required],
    people_count: [1, [Validators.required, Validators.min(1)]],
  });

  protected isSubmitting = false;
  protected apiErrors: string[] = [];

  protected submit(): void {
    this.apiErrors = [];

    if (this.form.invalid) {
      this.form.markAllAsTouched();
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
