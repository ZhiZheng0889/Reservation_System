using Microsoft.AspNetCore.Mvc;
using Reservation.API.Contracts.Reservations;
using Reservation.Application.Reservations;

using ReservationEntity =
    Reservation.Application.Reservations.Reservation;

namespace Reservation.API.Controllers;

[ApiController]
[Route("reservations")]
public sealed class ReservationsController(
    IReservationService reservationService
) : ControllerBase
{
    [HttpPost]
    [ProducesResponseType<ReservationResponse>(StatusCodes.Status201Created)]

    [ProducesResponseType<ValidationProblemDetails>(StatusCodes.Status400BadRequest)]

    public async Task<ActionResult<ReservationResponse>> Create(
        CreateReservationRequest request,
        CancellationToken cancellationToken
    )
    {
        var command = new CreateReservationCommand(
            request.FirstName,
            request.LastName,
            request.MobileNumber,
            request.Email,
            request.ReservationDate!.Value,
            request.ReservationTime.Value,
            request.PeopleCount
        );

        var reservation = await reservationService.CreateAsync(
            command, cancellationToken
        );

        var response = MapResponse(reservation);

        return Created(
            $"/reservations/{reservation.Id}",
            response
        );
    }

    [HttpGet]
    [ProducesResponseType<ReservationResponse[]>(StatusCodes.Status200OK)]
    [ProducesResponseType( StatusCodes.Status400BadRequest)]

    public async Task<ActionResult<IReadOnlyList<ReservationResponse>>> GetForDate(
        [FromQuery] DateOnly? date,
        CancellationToken cancellationToken
    )
    {
        if (date is null)
        {
            return BadRequest(new ProblemDetails
            {
            Title = "A reservation date is required.",
                Detail = "Provide the date query parameter in YYYY-MM-DD format.",
                Status = StatusCodes.Status400BadRequest
            });
        }

        var reservations = await reservationService.GetForDateAsync(
            date.Value, cancellationToken
        );

        var response = reservations.Select(MapResponse).ToList();

        return Ok(response);
    }

    private static ReservationResponse MapResponse(
        ReservationEntity reservation
    )
    {
        return new ReservationResponse(
            reservation.Id,
            reservation.FirstName,
            reservation.LastName,
            reservation.MobileNumber,
            reservation.Email,
            reservation.ReservationDate,
            reservation.ReservationTime,
            reservation.PeopleCount
        );
    }
}