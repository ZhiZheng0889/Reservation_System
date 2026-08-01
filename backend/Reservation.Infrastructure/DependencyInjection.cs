using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Reservation.Infrastructure.Persistence;
using Reservation.Application.Reservations;
using Reservation.Infrastructure.Reservations;

namespace Reservation.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services,
        IConfiguration configuration
    )

    {
        var connectionString = configuration.GetConnectionString("DefaultConnection")
        ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");

        services.AddDbContext<ReservationDbContext>(options =>
            options.UseNpgsql(connectionString));

        services.AddScoped<IReservationService, ReservationService>();

        return services;
    }
}