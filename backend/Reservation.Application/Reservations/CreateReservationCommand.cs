namespace Reservation.Application.Reservations;

public sealed record CreateReservationCommand(
    string FirstName,
    string LastName,
    string MobileNumber,
    string Email,
    DateOnly ReservationDate,
    TimeOnly ReservationTime,
    int PeopleCount
    
);  