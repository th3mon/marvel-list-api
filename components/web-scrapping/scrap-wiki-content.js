const clients = require('restify-clients');
const lodash = require('lodash');
const createJsonFileWriter = require('./create-json-file-writer');
const config = require('../../config');
const createMovieDataScrapper = require('./create-scrap-movies-data');
const createMoviePosterUrlScrapper = require('./create-movie-poster-url-scrapper');

const scrapMoviesData = createMovieDataScrapper(clients.createJsonClient(config.wikiApi.url));
const scrapMoviePosterUrl = createMoviePosterUrlScrapper(clients.createStringClient(config.wikiApi.url));

function writeToFile(content) {
  const wikiDataWriter = createJsonFileWriter('data-from-wiki');

  wikiDataWriter(content);
}

function run() {
  const scrappedData = [];
  let moviesLength = -1;
  let counter = 0;
  let progress = 0;

  return new Promise(resolve => {
    scrapMoviesData().then(movies => {
      moviesLength = movies.length;

      movies.forEach(movie => scrapMoviePosterUrl(movie.url).then(imageUrl => {
        scrappedData[movie.id] = Object.assign(movie, { imageUrl });

        counter += 1;

        progress = counter === 0
          ? counter
          : parseInt((counter / moviesLength) * 100, 10);

        console.log(`${progress}%`);
      }));
    });

    const interval = setInterval(() => {
      if (moviesLength === counter) {
        clearInterval(interval);

        if (!lodash.isEmpty(scrappedData)) {
          writeToFile(JSON.stringify({ movies: scrappedData }, null, 2));
        }

        resolve(console.log('done!'));
      }
    }, 100);
  });
}

module.exports = { run };
