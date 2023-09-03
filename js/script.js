const globalPage = {
  currentLocation: window.location.pathname,
};

// highlight active link
function highligthCurrenLink() {
  const links = document.querySelectorAll('.nav-link');
  links.forEach((link) => {
    if (link.getAttribute('href') === globalPage.currentLocation) {
      link.classList.add('active');
    }
  });
}

// display popular movies
async function displayPopularMovies() {
  const { results } = await fetchData('/movie/popular');

  results.forEach((movie) => {
    const div = document.createElement('div');
    div.className = 'card';
    div.innerHTML = `
    <a href="movie-details.html?id=${movie.id}">
     ${
       movie.poster_path
         ? ` <img
           src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
           class='card-img-top'
           alt='${movie.title}'
         />`
         : ` <img
           src='../images/no-image.jpg'
           class='card-img-top'
           alt='${movie.title}'
         />`
     }
    </a>
    <div class="card-body">
      <h5 class="card-title">${movie.title}</h5>
      <p class="card-text">
        <small class="text-muted">Release: ${movie.release_date}</small>
      </p>
    </div>
  `;

    document.querySelector('#popular-movies').appendChild(div);
  });
}

// display popular shows
async function displayPopularShows() {
  const { results } = await fetchData('/tv/popular');

  results.forEach((show) => {
    const div = document.createElement('div');
    div.className = 'card';
    div.innerHTML = `
    <a href="tv-details.html?id=${show.id}">
     ${
       show.poster_path
         ? ` <img
           src="https://image.tmdb.org/t/p/w500${show.poster_path}"
           class='card-img-top'
           alt='${show.original_name}'
         />`
         : ` <img
           src='../images/no-image.jpg'
           class='card-img-top'
           alt='${show.original_name}'
         />`
     }
    </a>
    <div class="card-body">
      <h5 class="card-title">${show.original_name}</h5>
      <p class="card-text">
        <small class="text-muted">Release: ${show.first_air_date}</small>
      </p>
    </div>
  `;

    document.querySelector('#popular-shows').appendChild(div);
  });
}

//Display movies details page
async function displayMovieDetails() {
  const movieId = window.location.search.split('=')[1];
  const movieDetailRes = await fetchData(`movie/${movieId}`);

  const div = document.querySelector('#movie-details');
  div.innerHTML = `
<div class="details-top">
  <div>
  ${
    movieDetailRes.poster_path
      ? `<img
  src="https://image.tmdb.org/t/p/w500${movieDetailRes.poster_path}"
    class="card-img-top"
    alt="${movieDetailRes.original_title}"
  />`
      : ` <img
        src='../images/no-image.jpg'
        class='card-img-top'
        alt='${movieDetailRes.original_title}'
      />`
  }
  </div>
  <div>
    <h2>${movieDetailRes.original_title}</h2>
    <p>
      <i class="fas fa-star text-primary"></i>
      ${movieDetailRes.vote_average.toFixed(1)} / 10
    </p>
    <p class="text-muted">Release Date: ${movieDetailRes.release_date}</p>
    <p>
     ${movieDetailRes.overview}
    </p>
    <h5>Genres</h5>
    <ul class="list-group">
      ${movieDetailRes.genres.map((genre) => `<li>${genre.name}</li>`).join('')}
    </ul>
    <a href="${
      movieDetailRes.homepage
    }" target="_blank" class="btn">Visit Movie Homepage</a>
  </div>
</div>
<div class="details-bottom">
  <h2>Movie Info</h2>
  <ul>
    <li><span class="text-secondary">Budget:</span> $${addCommasToNumber(
      movieDetailRes.budget
    )}</li>
    <li><span class="text-secondary">Revenue:</span> $${addCommasToNumber(
      movieDetailRes.revenue
    )}</li>
    <li><span class="text-secondary">Runtime:</span> ${
      movieDetailRes.runtime
    } minutes</li>
    <li><span class="text-secondary">Status:</span> ${
      movieDetailRes.status
    }</li>
    
  </ul>
  <h4>Production Companies</h4>
  <div class="list-group">      ${movieDetailRes.production_companies
    .map((company) => company.name)
    .join(', ')}
  </div>
</div>
`;

  movieDetailsBackground('movie', movieDetailRes.backdrop_path);
}

// background image for movie details
function movieDetailsBackground(type, path) {
  const overlayDiv = document.createElement('div');

  overlayDiv.style.backgroundImage = `url(https://image.tmdb.org/t/p/original/${path})`;
  overlayDiv.style.backgroundSize = 'cover';
  overlayDiv.style.backgroundPosition = 'center';
  overlayDiv.style.backgroundRepeat = 'no-repeat';
  overlayDiv.style.height = '100vh';
  overlayDiv.style.width = '100vw';
  overlayDiv.style.position = 'absolute';
  overlayDiv.style.top = '0';
  overlayDiv.style.left = '0';
  overlayDiv.style.zIndex = '-1';
  overlayDiv.style.opacity = '0.1';

  if (type === 'movie') {
    document.querySelector('#movie-details').appendChild(overlayDiv);
  } else {
    document.querySelector('#show-details').appendChild(overlayDiv);
  }
}

// display show details
async function displayShowDetails() {
  const showId = window.location.search.split('=')[1];
  const showDetailsRes = await fetchData(`/tv/${showId}`);
  document.querySelector('#show-details').innerHTML = `
        <div class="details-top">
          <div>

          ${
            showDetailsRes.poster_path
              ? `<img
            src="https://image.tmdb.org/t/p/w500${showDetailsRes.poster_path}"
            class="card-img-top"
            alt="Show Name"
          />`
              : ` <img
                src='../images/no-image.jpg'
                class='card-img-top'
                alt='Show Name'
              />`
          }
            
          </div>
          <div>
            <h2>${showDetailsRes.original_name}</h2>
            <p>
              <i class="fas fa-star text-primary"></i>
              ${showDetailsRes.vote_average.toFixed(1)} / 10
            </p>
            <p class="text-muted">Release Date: ${
              showDetailsRes.first_air_date
            }</p>
            <p>
             ${showDetailsRes.overview}
            </p>
            <h5>Genres</h5>
            <ul class="list-group">

            ${showDetailsRes.genres
              .map((genre) => `<li>${genre.name}</li>`)
              .join('')}
              
            
            </ul>
            <a href="${
              showDetailsRes.homepage
            }}" target="_blank" class="btn">Visit Show Homepage</a>
          </div>
        </div>
        <div class="details-bottom">
          <h2>Show Info</h2>
          <ul>
            <li><span class="text-secondary">Number Of Episodes:</span> ${
              showDetailsRes.number_of_episodes
            }</li>
            <li>
              <span class="text-secondary">Last Episode To Air:</span> ${
                showDetailsRes.last_episode_to_air.name
              }
            </li>
            <li><span class="text-secondary">Status:</span> ${
              showDetailsRes.status
            }</li>
          </ul>
          <h4>Production Companies</h4>
          <div class="list-group">${showDetailsRes.production_companies
            .map((company) => company.name)
            .join(', ')}</div>
        </div>
`;

  movieDetailsBackground('TV', showDetailsRes.backdrop_path);
}

// display now playing slider

async function nowPlaying() {
  const { results } = await fetchData('/movie/now_playing');

  results.forEach((result) => {
    const div = document.createElement('div');
    div.className = 'swiper-slide';
    div.innerHTML = `
    <div class="swiper-slide">
            <a href="movie-details.html?id=${result.id}">

            ${
              result.poster_path
                ? `    <img
                src="https://image.tmdb.org/t/p/w500${result.poster_path}"

                  alt="Movie Title" />`
                : `    <img src="./images/no-image.jpg" alt="Movie Title" />`
            }
          
            </a>
            <h4 class="swiper-rating">
              <i class="fas fa-star text-secondary"></i> ${
                result.vote_average
              } / 10
            </h4>
          </div>`;
    document.querySelector('.swiper-wrapper').appendChild(div);
    initSwiper();
    // movieDetailsBackground('TV', result.backdrop_path);
  });

  console.log(results);
}

function initSwiper() {
  const swiper = new Swiper('.swiper', {
    slidesPerView: 1,
    spaceBetween: 30,
    freeMode: true,
    loop: true,
    autoplay: {
      delay: 4000,
      // disableOnInteraction: false,
    },
    breakpoints: {
      500: {
        slidesPerView: 2,
        spaceBetween: 20,
      },
      700: {
        slidesPerView: 3,
        spaceBetween: 30,
      },
      1200: {
        slidesPerView: 4,
        spaceBetween: 40,
      },
    },
  });
}

// add comma to amount
function addCommasToNumber(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
// show spinner
function showSpinner() {
  document.querySelector('.spinner').classList.add('show');
}

// hide spinner
function hideSpinner() {
  document.querySelector('.spinner').classList.remove('show');
}

// fetch data
async function fetchData(endpoint) {
  const API_KEY = '';
  const apiURL = 'https://api.themoviedb.org/3/';

  showSpinner();
  const response = await fetch(
    `${apiURL}${endpoint}?api_key=${API_KEY}&language=en-US`,
    {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization:
          'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhOTRhZTk0NGFhODY4YjY5Zjc3NDk4ZDdhYzJiYWFmMSIsInN1YiI6IjY0ZjBmNzY3Y2FhNTA4MDE0YzhiYjk4NiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.vsI9vscEh5elOXMgmG6ESChyA6rAg6DM4xtnbqXfWtU',
      },
    }
  );
  const data = await response.json();

  hideSpinner();
  return data;
}

function init() {
  switch (globalPage.currentLocation) {
    case '/':
    case '/index.html':
      displayPopularMovies();
      nowPlaying();
      break;
    case '/shows.html':
      displayPopularShows();
      break;
    case '/movie-details.html':
      displayMovieDetails();
      break;
    case '/tv-details.html':
      displayShowDetails();
      break;

    case '/search.html':
      console.log('Search');
      break;
  }

  highligthCurrenLink();
}

document.addEventListener('DOMContentLoaded', init);
