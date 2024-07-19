# FLATDANGO MOVIE THEATERE
This project involves building a simple movie ticket booking application called "Flatdango". Here's a breakdown of its core features and functionality


# Movie Details
 When the page loads, the application displays details of the first movie from a local JSON server (e.g., title, runtime, showtime, available tickets, poster).
Movie Menu: A list of all available movies is shown on the left side of the page, allowing users to browse through different films.
Buy Tickets: Users can purchase tickets for a movie by clicking a "Buy Ticket" button. The number of available tickets for the chosen film dynamically decreases on the front end.

# Data Fetching
 The front-end uses GET requests to retrieve data (movie details, movie list) from the JSON server.
Ticket Purchase (Optional): In the bonus feature, the application can update the number of tickets_sold on the server using a PATCH request when a ticket is purchased, ensuring that the available tickets count remains accurate.
# Film Deletion
 Another bonus feature allows deleting a film from the server using a DELETE request, which also updates the movie list on the front end.

