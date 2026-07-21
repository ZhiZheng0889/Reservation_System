namespace Reservation.Application.Reservations;

public sealed class Reservation
{
    public int Id { get; set; }

    public required string FirstName { get; set; }

    public required string LastName { get; set; }

    public required string Email { get; set; }

    public required string MobileNumber { get; set; }

    public DateOnly ReservationDate { get; set; }

    public TimeOnly ReservationTime { get; set; }

    public int PeopleCount { get; set; }
}
