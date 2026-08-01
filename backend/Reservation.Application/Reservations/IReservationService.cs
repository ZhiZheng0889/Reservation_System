namespace Reservation.Application.Reservations;

public interface IReservationService
{
    Task<Reservation> CreateAsync(
        CreateReservationCommand command,
        CancellationToken cancellationToken
    );

    Task<IReadOnlyList<Reservation>> GetForDateAsync(
        DateOnly date,
        CancellationToken cancellationToken
    );
}