const globalPage = {
  currentLocation: window.location.pathname,
  search: {
    type: '',
    term: '',
    page: 1,
    totalPages: 1,
    totalResult: 0,
  },
  api: {
    apiKey: 'a94ae944aa868b69f77498d7ac2baaf1',
    apiUrl: 'https://api.themoviedb.org/3/',
  },
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

//Display movies  details
async function displayMovieDetails() {
  const movieId = window.location.search.split('=')[1];
  const movieDetailRes = await fetchData(`movie/${movieId}`);
  const credits = await movieCredits('movie', movieId);

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
    <li><span class="text-secondary">Cast:</span> ${credits.credits.cast
      .map(
        (person) =>
          `<a href="cast-details.html?id=${person.id}" target="_blank" class="cast_name"> ${person.name}</a>`
      )
      .slice(0, 5)
      .join(`,  `)}</li>
  
    
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

// display cast details
async function displayCastDetails() {
  const castId = window.location.search.split('=')[1];
  const cast = await fetchData(`person/${castId}`);
  console.log(cast);

  document.querySelector('#cast-details').innerHTML = `
  <div class="details-top">
    <div>

    ${
      cast.profile_path
        ? `<img
      src="https://image.tmdb.org/t/p/w500${cast.profile_path}"
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
      <h2>${cast.name}</h2>
      
      <p class="text-muted">Popularity: ${cast.popularity.toFixed(1)}</p>
      <p>
       ${cast.biography}
      </p>
     
      <a href="${
        cast.homepage
      }}" target="_blank" class="btn">Visit Show Homepage</a>
    </div>
  </div>
  <div class="details-bottom">
    <h2>Show Info</h2>
    <ul>
      <li><span class="text-secondary">Known for:</span> ${
        cast.known_for_department
      }</li>
      <li>
        <span class="text-secondary">Place of birth:</span> ${
          cast.place_of_birth
        }
      </li>
      <li><span class="text-secondary">Birthday:</span> ${cast.birthday}</li>
    </ul>
    <h4>Also known as</h4>
    <div class="list-group">${cast.also_known_as
      .map((aka) => aka)
      .join(', ')}</div>
   
  </div>
`;
  movieDetailsBackground('cast', cast.profile_path);

  // document.getElementById(
  //   'goBackButton'
  // ).href = `/cast-details.html?id=${castId}`;
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
  } else if (type === 'TV') {
    document.querySelector('#show-details').appendChild(overlayDiv);
  } else {
    document.querySelector('#cast-details').appendChild(overlayDiv);
  }
}

// display show details
async function displayShowDetails() {
  const showId = window.location.search.split('=')[1];
  const showDetailsRes = await fetchData(`/tv/${showId}`);
  const credits = await movieCredits('tv', showId);
  console.log(credits);
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
            <li><span class="text-secondary">Cast:</span> ${credits.credits.cast
              .map(
                (person) =>
                  `<a href="cast-details.html?id=${person.id}" target="_blank" class="cast_name"> ${person.name}</a>`
              )
              .slice(0, 5)
              .join(`,  `)}</li>
          </ul>
          <h4>Production Companies</h4>
          <div class="list-group">${showDetailsRes.production_companies
            .map((company) => company.name)
            .join(', ')}</div>
        </div>
`;

  movieDetailsBackground('TV', showDetailsRes.backdrop_path);
}

// display now playing movie slider
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
  });
}

// display trending shows slider
async function trendingShows() {
  const { results } = await fetchData('trending/tv/day');

  results.forEach((result) => {
    const div = document.createElement('div');
    div.className = 'swiper-slide';
    div.innerHTML = `
    <div class="swiper-slide">
    <a href="tv-details.html?id=${result.id}">

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
  });
}

// display search output
function displaySearchResult(results) {
  globalPage.search.type === 'tv'
    ? (document.querySelector('#tv').checked = true)
    : (document.querySelector('#movie').checked = true);

  document.querySelector('#search-results').innerHTML = '';
  document.querySelector('#search-results-heading').innerHTML = '';
  document.querySelector('#pagination').innerHTML = '';

  results.forEach((result) => {
    const div = document.createElement('div');
    div.className = 'card';

    globalPage.search.type === 'movie'
      ? (div.innerHTML = `
    <a
    ${`href = movie-details.html?id=${result.id}`}

  >
    ${
      result.poster_path
        ? `    <img
        src="https://image.tmdb.org/t/p/w500${result.poster_path}" class="card-img-top" alt="" />`
        : `    <img src="./images/no-image.jpg" alt="Movie Title" />`
    } </a>
         
          <div class="card-body">
            <h5 class="card-title">${result.original_title}</h5>
            <p class="card-text">
              <small class="text-muted">Release: ${result.release_date}</small>
            </p>
          </div>
          </a>`)
      : (div.innerHTML = `
          <a
          ${`href = tv-details.html?id=${result.id}`}

        >
          ${
            result.poster_path
              ? `    <img
              src="https://image.tmdb.org/t/p/w500${result.poster_path}" class="card-img-top" alt="" />`
              : `    <img src="./images/no-image.jpg" alt="Movie Title" />`
          } </a>
               
                <div class="card-body">
                  <h5 class="card-title">${result.original_name}</h5>
                  <p class="card-text">
                    <small class="text-muted">Release: ${
                      result.first_air_date
                    }</small>
                  </p>
                </div>
                </a>`);

    document.getElementById('search-results-heading').innerHTML = `
    <p>${results.length} of ${globalPage.search.totalResult} for ${globalPage.search.term} </p>
    `;
    document.getElementById('search-results').appendChild(div);
  });

  displayPagination();
}

// display pagination
function displayPagination() {
  const pageEl = document.createElement('div');
  pageEl.classList.add('pagination');
  pageEl.innerHTML = `
  <button class="btn btn-primary" id="prev">Prev</button>
  <button class="btn btn-primary" id="next">Next</button>
  <div class="page-counter">Page ${globalPage.search.page} of ${globalPage.search.totalPages}</div>
  `;

  document.getElementById('pagination').appendChild(pageEl);

  if (globalPage.search.page === 1) {
    document.querySelector('#prev').disabled = true;
  }

  if (globalPage.search.page === globalPage.search.totalPages) {
    document.querySelector('#next').disabled = true;
  }

  //display next page
  document.querySelector('#next').addEventListener('click', async () => {
    globalPage.search.page++;

    const { results, total_pages } = await searchApiData();

    displaySearchResult(results);
  });
  //display previous page
  document.querySelector('#prev').addEventListener('click', async () => {
    globalPage.search.page--;

    const { results, total_pages } = await searchApiData();

    displaySearchResult(results);
  });
}

function initSwiper() {
  const swiper = new Swiper('.swiper', {
    slidesPerView: 1,
    spaceBetween: 30,
    freeMode: true,
    loop: true,
    autoplay: {
      delay: 4000,
      disableOnInteraction: false,
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

// search
async function search() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  globalPage.search.type = urlParams.get('type');
  globalPage.search.term = urlParams.get('search-term');

  if (globalPage.search.term !== '' && globalPage.search.term !== null) {
    const { results, total_pages, page, total_results } = await searchApiData();

    globalPage.search.totalPages = total_pages;
    globalPage.search.totalResult = total_results;
    globalPage.search.page = page;

    if (results.length === 0) {
      showAlert('No result found', 'error');
    }

    displaySearchResult(results);
  } else {
    showAlert('Pls enter a search item');
  }
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

// show alert
function showAlert(message, classname) {
  const alertEl = document.querySelector('div');
  alertEl.classList.add('alert', classname);
  alertEl.innerText = message;
  document.querySelector('#alert').appendChild(alertEl);

  setTimeout(() => alertEl.remove(), 5000);
}

// fetch data
async function fetchData(endpoint) {
  const API_KEY = globalPage.api.apiKey;
  const apiURL = globalPage.api.apiUrl;

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

// fetch movie credits
async function movieCredits(type, movieId) {
  const API_KEY = globalPage.api.apiKey;
  const apiURL = globalPage.api.apiUrl;
  const person = await fetch(
    `${apiURL}${type}/${movieId}?api_key=${API_KEY}&append_to_response=credits
    `,
    {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization:
          'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhOTRhZTk0NGFhODY4YjY5Zjc3NDk4ZDdhYzJiYWFmMSIsInN1YiI6IjY0ZjBmNzY3Y2FhNTA4MDE0YzhiYjk4NiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.vsI9vscEh5elOXMgmG6ESChyA6rAg6DM4xtnbqXfWtU',
      },
    }
  );
  const data = await person.json();
  return data;
}

// fetch search data
async function searchApiData() {
  const API_KEY = globalPage.api.apiKey;
  const API_URL = globalPage.api.apiUrl;

  showSpinner();

  const response = await fetch(
    `${API_URL}search/${globalPage.search.type}?api_key=${API_KEY}&language=en-US&query=${globalPage.search.term}&page=${globalPage.search.page}`,
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
      trendingShows();
      break;
    case '/movie-details.html':
      displayMovieDetails();
      break;
    case '/tv-details.html':
      displayShowDetails();
      break;

    case '/search.html':
      search();
      break;
    case '/cast-details.html':
      displayCastDetails();
      break;
  }

  highligthCurrenLink();
}

document.addEventListener('DOMContentLoaded', init);
