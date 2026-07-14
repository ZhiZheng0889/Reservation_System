# Reserveration System

## Tech Stack

### Frontend

- Angular (22): https://angular.dev/
- Bootstrap (5): bootstrap https://getbootstrap.com/

### Backend

- ASP.NET:  https://dotnet.microsoft.com/en-us/apps/aspnet
- ORM: EF Core (Entity Framework Core): https://learn.microsoft.com/en-us/ef/
- PostgreSQL: https://www.postgresql.org/

## Backend Infrastructure

- Reservation.API: Contains api related code
- Reservation.Infrastructure: Contains database persistence and infrastructure to get the app working.
- Reservation.Application: Contains Services, Contracts, etc.

## Product Backlog

### Prerequisites (US-00)

#### Devops

Create github action pipelines to build, and verify tests work for the front end and backend.

Potentially create github action to ensure migrations work by running a local database on the github action.

#### Frontend 

Create a navbar and basic layout with footer that can be reused on all the pages. Style the not found page.

#### Backend

Connect entity framework core:
- Setup dockerfile to create postgresql database.
- Setup appsettings and configuration (similar to .env file).
- Create database context and related entities (none for now).a
- Setup entity framework migration infrastructure.

### US-01 Create and list reservations

As a restaurant manager
I want to create a new reservation when a customer calls
so that I know how many customers will arrive at the restaurant on a given day.
Acceptance Criteria

1. The /reservations/new page will
    - have the following required and not-nullable fields:
        - First name: <input name="first_name" />
        - Last name: <input name="last_name" />
        - Mobile number: <input name="mobile_number" />
        - Date of reservation: <input name="reservation_date" />
        - Time of reservation: <input name="reservation_time" />
        - Number of people in the party, which must be at least 1 person.  <input name="people" />
    - display a Submit button that, when clicked, saves the new reservation, then displays the /dashboard page for the date of the new reservation
    - display a Cancel button that, when clicked, returns the user to the previous page
    - display any error messages returned from the API
2. The /dashboard page will
    - list all reservations for one date only. (E.g. if the URL is /dashboard?date=2035-12-30 then send a GET to /reservations?date=2035-12-30 to list the reservations for that date). The date is defaulted to today, and the reservations are sorted by time.
    - display next, previous, and today buttons that allow the user to see reservations on other dates
    - display any error messages returned from the API
    The /reservations API will have the same validations as above and will return 400, along with an informative error message, when a validation error happens. 