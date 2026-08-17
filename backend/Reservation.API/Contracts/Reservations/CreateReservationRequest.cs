using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Reservation.API.Contracts.Reservations;

public sealed class CreateReservationRequest
{
    [Required(ErrorMessage = "First name is required.")]
    [MaxLength(100, ErrorMessage = "First name cannot be longer than 100 characters.")]
    [JsonPropertyName("first_name")]
    public string FirstName { get; init; } = string.Empty;

    [Required(ErrorMessage = "Last name is required.")]
    [MaxLength(100, ErrorMessage = "Last name cannot be longer than 100 characters.")]
    [JsonPropertyName("last_name")]
    public string LastName { get; init; } = string.Empty;

    [Required(ErrorMessage = "Email is required.")]
    [EmailAddress(ErrorMessage = "Invalid Email Address")]
    [MaxLength(100, ErrorMessage = "Email cannot be longer than 100 characters.")]
    [JsonPropertyName("email")]
    public string Email { get; init; } = string.Empty;

    [Required(ErrorMessage = "Mobile number is required.")]
    [MaxLength(30, ErrorMessage = "Mobile number cannot be longer than 30 characters.")]
    [JsonPropertyName("mobile_number")]
    public string MobileNumber { get; init; } = string.Empty;

    [Required(ErrorMessage = "Reservation date is required.")]
    [JsonPropertyName("reservation_date")]
    public DateOnly? ReservationDate { get; init; }

    [Required(ErrorMessage = "Reservation time is required.")]
    [JsonPropertyName("reservation_time")]
    public TimeOnly? ReservationTime { get; init; }

    [Range(1, int.MaxValue, ErrorMessage = "People count must be at least 1.")]
    [JsonPropertyName("people_count")]
    public int PeopleCount { get; init; }

}