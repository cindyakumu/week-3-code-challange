document.addEventListener('DOMContentLoaded', function() {
    const filmsUrl = 'http://localhost:3000/films'; // My JSON server URL

    // Function to fetch all films and populate the movie list
    function fetchFilms() {
        fetch(filmsUrl)
            .then(response => response.json())
            .then(films => {
                const filmsList = document.getElementById('films');
                films.forEach(film => {
                    const li = document.createElement('li');
                    li.classList.add('film');
                    li.textContent = film.title;
                    li.dataset.filmId = film.id;
                    filmsList.appendChild(li);
                });

                // Add click event listener to each film item
                filmsList.addEventListener('click', handleFilmClick);

                // Display details of the first film by default
                if (films.length > 0) {
                    fetchFilmDetails(films[0].id); // Fetch and display details of the first film
                }
            })
            .catch(error => console.error('Error fetching films:', error));
    }

    // Function to handle click events on film items
    function handleFilmClick(event) {
        if (event.target.tagName === 'LI') {
            const filmId = event.target.dataset.filmId;
            fetchFilmDetails(filmId);
        }
    }

    // Function to fetch and display movie details
    function fetchFilmDetails(filmId) {
        fetch(`${filmsUrl}/${filmId}`)
            .then(response => response.json())
            .then(displayMovieDetails)
            .catch(error => console.error('Error fetching movie details:', error));
    }

    // Function to display movie details
    function displayMovieDetails(film) {
        const movieDetailsSection = document.getElementById('movie-details');
        movieDetailsSection.innerHTML = `
            <div class="movie-info">
                <h2>${film.title}</h2>
                <p><strong>Runtime:</strong> ${film.runtime} mins</p>
                <p><strong>Showtime:</strong> ${film.showtime}</p>
                <p><strong>Available Tickets:</strong> ${film.capacity - film.tickets_sold}</p>
                <p>${film.description}</p>
                <img id="movie-poster" src="${film.poster}" alt="${film.title} Poster">
                <button class="buy-ticket" data-film-id="${film.id}">Buy Ticket</button>
            </div>
        `;

        // Apply styles to the movie poster
        const moviePoster = document.getElementById('movie-poster');
        if (moviePoster) {
            moviePoster.style.maxWidth = '600px';
            moviePoster.style.height = '600px';
            moviePoster.style.display = 'block';
            moviePoster.style.margin = '0 auto';
        }

        // Add click event listener to the "Buy Ticket" button
        const buyTicketButton = document.querySelector('.buy-ticket');
        if (buyTicketButton) {
            buyTicketButton.addEventListener('click', handleBuyTicketClick);
        }
    }

    // Function to handle the "Buy Ticket" button click
    function handleBuyTicketClick(event) {
        const filmId = event.target.dataset.filmId;
        fetch(`${filmsUrl}/${filmId}`)
            .then(response => response.json())
            .then(film => {
                if (film.capacity - film.tickets_sold > 0) {
                    film.tickets_sold++;
                    // Update the server with the new tickets_sold value
                    fetch(`${filmsUrl}/${filmId}`, {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ tickets_sold: film.tickets_sold })
                    })
                    .then(() => {
                        displayMovieDetails(film); // Update the UI
                    })
                    .catch(error => console.error('Error updating tickets sold:', error));
                } else {
                    event.target.textContent = 'Sold Out';
                    event.target.disabled = true;
                }
            })
            .catch(error => console.error('Error fetching film for buy ticket:', error));
    }

    // Initial fetch of films when the page loads
    fetchFilms();
});

