using Microsoft.EntityFrameworkCore;
using Reservation.Application.Reservations;
using Reservation.Infrastructure.Persistence;
using ReservationEntity =
    Reservation.Application.Reservations.Reservation;
    
namespace Reservation.Infrastructure.Reservations;
public sealed class ReservationService(
    ReservationDbContext dbContext
) : IReservationService
{
    public async Task<ReservationEntity> CreateAsync(
        CreateReservationCommand command, 
        CancellationToken cancellationToken
    )
    {
        var reservation = new ReservationEntity
        {
            FirstName = command.FirstName.Trim(),
            LastName = command.LastName.Trim(),
            MobileNumber = command.MobileNumber.Trim(),
            Email = command.Email.Trim(),
            ReservationDate = command.ReservationDate,
            ReservationTime = command.ReservationTime,
            PeopleCount = command.PeopleCount
        };

        dbContext.Reservations.Add(reservation);
        
        await dbContext.SaveChangesAsync(cancellationToken);

        return reservation;

    }

    public async Task<IReadOnlyList<ReservationEntity>>
            GetForDateAsync(
            DateOnly date,
            CancellationToken cancellationToken
        )
    {
        return await dbContext.Reservations
            .AsNoTracking()
            .Where(r => r.ReservationDate == date)
            .OrderBy(r => r.ReservationTime)
            .ThenBy(r => r.Id)
            .ToListAsync(cancellationToken);
    }
}
