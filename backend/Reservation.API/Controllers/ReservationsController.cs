using Microsoft.AspNetCore.Mvc;
using Reservation.API.Contracts.Reservations;
using Reservation.Application.Reservations;

using ReservationEntity = Reservation.Application.Reservations.Reservation;

namespace Reservation.API.Controllers;

[ApiController]
[Route("reservations")]
public sealed class ReservationsController(IReservationService reservationService) : ControllerBase
{
    [HttpPost]
    [ProducesResponseType<int>(StatusCodes.Status201Created)]
    [ProducesResponseType<ValidationProblemDetails>(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<int>> Create(
        CreateReservationRequest request,
        CancellationToken cancellationToken)
    {
        if (request.ReservationDate is not { } reservationDate ||
            request.ReservationTime is not { } reservationTime)
        {
            if (request.ReservationDate is null)
            {
                ModelState.AddModelError(
                    nameof(request.ReservationDate),
                    "The reservation date is required.");
            }

            if (request.ReservationTime is null)
            {
                ModelState.AddModelError(
                    nameof(request.ReservationTime),
                    "The reservation time is required.");
            }

            return ValidationProblem(ModelState);
        }

        if (reservationDate.DayOfWeek == DayOfWeek.Tuesday)
        {
            ModelState.AddModelError(
                nameof(request.ReservationDate),
                "Reservation date cannot be a Tuesday because the restaurant is closed.");
            return ValidationProblem(ModelState);
        }

        if (reservationDate <= DateOnly.FromDateTime(DateTime.Today))
        {
            ModelState.AddModelError(
                nameof(request.ReservationDate),
                "Reservation date must be in the future.");
            return ValidationProblem(ModelState);
        }

        var command = new CreateReservationCommand(
            request.FirstName!,
            request.LastName!,
            request.MobileNumber!,
            request.Email!,
            reservationDate,
            reservationTime,
            request.PeopleCount);

        var reservation = await reservationService.CreateAsync(command, cancellationToken);

        return StatusCode(StatusCodes.Status201Created, reservation.Id);
    }

    [HttpGet]
    [ProducesResponseType<ReservationResponse[]>(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<IReadOnlyList<ReservationResponse>>> GetForDate(
        [FromQuery] DateOnly? date,
        CancellationToken cancellationToken)
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

        var reservations = await reservationService.GetForDateAsync(date.Value, cancellationToken);

        var response = reservations.Select(MapResponse).ToList();

        return Ok(response);
    }

    private static ReservationResponse MapResponse(ReservationEntity reservation)
    {
        return new ReservationResponse(
            reservation.Id,
            reservation.FirstName,
            reservation.LastName,
            reservation.Email,
            reservation.MobileNumber,
            reservation.ReservationDate,
            reservation.ReservationTime,
            reservation.PeopleCount);
    }
}
