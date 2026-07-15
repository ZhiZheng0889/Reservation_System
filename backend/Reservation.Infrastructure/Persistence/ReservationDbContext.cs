using Microsoft.EntityFrameworkCore;

namespace Reservation.Infrastructure.Persistence;
    
public sealed class ReservationDbContext : DbContext
{
    public ReservationDbContext(DbContextOptions<ReservationDbContext> options) 
    : base(options)
    {
    }
}