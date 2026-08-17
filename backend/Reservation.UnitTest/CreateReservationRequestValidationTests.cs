using System.ComponentModel.DataAnnotations;
using Reservation.API.Contracts.Reservations;

namespace Reservation.UnitTest;

public sealed class CreateReservationRequestValidationTests
{
    private static IReadOnlyList<ValidationResult> Validate(
        CreateReservationRequest request)
    {
        var results = new List<ValidationResult>();
        var context = new ValidationContext(request);

        Validator.TryValidateObject(
            request,
            context,
            results,
            validateAllProperties: true);

        return results;
    }

    private static CreateReservationRequest CreateValidRequest(
        string firstName = "Jane",
        string lastName = "Doe",
        string mobileNumber = "555-123-4567",
        string email = "jane@example.com",
        int peopleCount = 4)
    {
        return new CreateReservationRequest
        {
            FirstName = firstName,
            LastName = lastName,
            MobileNumber = mobileNumber,
            Email = email,
            ReservationDate = new DateOnly(2035, 12, 30),
            ReservationTime = new TimeOnly(18, 30),
            PeopleCount = peopleCount
        };
    }

    [Test]
    public void Valid_request_has_no_validation_errors()
    {
        var request = CreateValidRequest();

        var errors = Validate(request);

        Assert.That(errors, Is.Empty);
    }

    [TestCase("")]
    [TestCase("   ")]
    public void Blank_first_name_is_rejected(string firstName)
    {
        var request = CreateValidRequest(firstName: firstName);

        var errors = Validate(request);

        Assert.That(
            errors.Select(error => error.ErrorMessage),
            Does.Contain("First name is required."));
    }
}