using Microsoft.EntityFrameworkCore;
using ReservationEntity = Reservation.Application.Reservations.Reservation;

namespace Reservation.Infrastructure.Persistence;

public sealed class ReservationDbContext : DbContext
{
    public ReservationDbContext(DbContextOptions<ReservationDbContext> options) : base(options)
    {
    }

    public DbSet<ReservationEntity> Reservations => Set<ReservationEntity>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        var reservation = modelBuilder.Entity<ReservationEntity>();

        reservation.ToTable("reservations");

        reservation.HasKey(x => x.Id);

        reservation.Property(x => x.Id)
            .HasColumnName("reservation_id");

        reservation.Property(x => x.FirstName)
            .HasColumnName("first_name")
            .HasMaxLength(100)
            .IsRequired();

        reservation.Property(x => x.LastName)
            .HasColumnName("last_name")
            .HasMaxLength(100)
            .IsRequired();

        reservation.Property(x => x.MobileNumber)
            .HasColumnName("mobile_number")
            .HasMaxLength(30)
            .IsRequired();

        reservation.Property(x => x.Email) 
            .HasColumnName("email")
            .HasMaxLength(100)
            .IsRequired();

        reservation.Property(x => x.ReservationDate)    
            .HasColumnName("reservation_date")
            .IsRequired();

        reservation.Property(x => x.ReservationTime)
            .HasColumnName("reservation_time")
            .IsRequired();

        reservation.Property(x => x.PeopleCount)
            .HasColumnName("people_count")
            .IsRequired();
        
        reservation.ToTable(table => 
            table.HasCheckConstraint("CK_Reservations_PeopleCount", "people_count >= 1"));

        reservation.HasIndex(x => new { x.ReservationDate, x.ReservationTime });

    }
}