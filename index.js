document.addEventListener('DOMContentLoaded', function() {
  const filmsUrl = 'http://localhost:3000/films'; 

  // Function to fetch all films and populate the movie list
  function fetchFilms() {
    fetch(filmsUrl)
      .then(response => response.json())
      .then(films => {
        const filmsList = document.getElementById('films');
        filmsList.innerHTML = ''; 
        // Clear any existing list items

        films.forEach(film => {
          const li = document.createElement('li');
          li.textContent = film.title;
          li.dataset.filmId = film.id;
          li.addEventListener('click', () => {
            displayFilmDetails(film.id);
          });
          filmsList.appendChild(li);
        });
      })
      .catch(error => console.error('Error fetching films:', error));
  }

  // Function to display film details
  function displayFilmDetails(filmId) {
    fetch(filmsUrl)
      .then(response => response.json())
      .then(films => {
        const film = films.find(f => f.id == filmId);

        if (film) {
          document.getElementById('movie-title').textContent = film.title;
          document.getElementById('movie-runtime').textContent = `Runtime: ${film.runtime} mins`;
          document.getElementById('movie-showtime').textContent = `Showtime: ${film.showtime}`;
          document.getElementById('movie-description').textContent = film.description;
          document.getElementById('movie-available-tickets').textContent = film.capacity - film.tickets_sold;

          const moviePoster = document.getElementById('movie-poster');
          if (moviePoster) {
            moviePoster.src = film.poster; // Assuming your JSON has a 'poster' property
            moviePoster.alt = film.title + " Poster";
          }

          const buyTicketButton = document.getElementById('buy-ticket-btn');
          buyTicketButton.disabled = false; // Enable the button
          buyTicketButton.textContent = "Buy Ticket"; // Reset button text

          // Remove any previous event listeners to avoid multiple bindings
          buyTicketButton.replaceWith(buyTicketButton.cloneNode(true));
          const newBuyTicketButton = document.getElementById('buy-ticket-btn');

          // Add a click event listener to the "Buy Ticket" button
          newBuyTicketButton.addEventListener('click', () => {
            if (film.capacity - film.tickets_sold > 0) {
              film.tickets_sold++;
              document.getElementById('movie-available-tickets').textContent = film.capacity - film.tickets_sold;

              // Update the film in the server
              fetch(`${filmsUrl}/${film.id}`, {
                method: 'PATCH',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ tickets_sold: film.tickets_sold }),
              })
              .then(response => response.json())
              .then(updatedFilm => {
                alert("sold out!");
              })
              .catch(error => console.error('Error updating film:', error));
            } else {
              newBuyTicketButton.disabled = true;
              newBuyTicketButton.textContent = "Sold Out";
            }
          });
        } else {
          console.error('Film not found');
        }
      })
      .catch(error => console.error('Error fetching film details:', error));
  }

  // Initial fetch of films
  fetchFilms();
});
