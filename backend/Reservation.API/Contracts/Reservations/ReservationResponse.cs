using System.Text.Json.Serialization;

namespace Reservation.API.Contracts.Reservations;

public sealed record ReservationResponse(
    [property: JsonPropertyName("reservation_id")] int ReservationId,
    [property: JsonPropertyName("first_name")]
    string FirstName,
    [property: JsonPropertyName("last_name")]
    string LastName,
    [property: JsonPropertyName("email")]
    string Email,
    [property: JsonPropertyName("mobile_number")]
    string PhoneNumber,
    [property: JsonPropertyName("reservation_date")]
    DateOnly ReservationDate,
    [property: JsonPropertyName("reservation_time")]
    TimeOnly ReservationTime,
    [property: JsonPropertyName("people_count")]
    int PeopleCount);
