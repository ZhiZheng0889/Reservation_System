export interface Reservation {
  reservation_id: number;
  first_name: string;
  last_name: string;
  mobile_number: string;
  email: string;
  reservation_date: string;
  reservation_time: string;
  people_count: number;
}

export type CreateReservationRequest = Omit<Reservation, 'reservation_id'>;
