const clients = require('restify-clients');
const cheerio = require('cheerio');
const lodash = require('lodash');
const parseHeaderCells = require('./parse-header-cells');
const isPhaseRow = require('./is-phase-row');
const isEmptyRow = require('./is-empty-row');
const createJsonFileWriter = require('./create-json-file-writer');
const parseMovieData = require('./parse-movie-data');
const config = require('../../config');

const wikiApiUrl = 'https://en.wikipedia.org';
const pageHtmlEndpointPath = '/api/rest_v1/page/html';
const featureFilmsSectionId = 'mwAac';
const client = clients.createJsonClient(wikiApiUrl);
const createMoviePosterUrlScrapper = require('./create-movie-poster-url-scrapper');

const scrapMoviePosterUrl = createMoviePosterUrlScrapper(clients.createStringClient(config.wikiApi.url));

function writeToFile(content) {
  const wikiDataWriter = createJsonFileWriter('data-from-wiki');

  wikiDataWriter(content);
}

const getHeaders = $headers => {
  const headersTexts = [];

  $headers.each((_, headerCell) =>
    headersTexts.push(cheerio.load(headerCell).text()));

  return parseHeaderCells(headersTexts);
};

function scrapMoviesData() {
  return new Promise((resolve, reject) => client.get(
    {
      path: `${pageHtmlEndpointPath}/Marvel_Cinematic_Universe`,
      query: {
        sections: featureFilmsSectionId
      }
    },
    (err, req, res, obj) => {
      if (err) {
        reject(err);
      }

      const html = obj[featureFilmsSectionId];
      const $ = cheerio.load(html);
      const table = $('.wikitable');

      const headers = getHeaders(table.find('tr:first-child th'));

      const movies = [];

      table
        .find('tr')
        .filter((_, row) => !isPhaseRow($(row).text()))
        .filter((_, row) => !isEmptyRow(row))
        .each((id, row) => {
          const movieData = parseMovieData(id, row, headers);

          if (movieData) {
            movies.push(movieData);
          }
        });

      resolve(movies);
    }
  ));
}

function run() {
  let moviesLength = -1;
  let counter = 0;
  const scrappedData = [];
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

module.exports = { run, isPhaseRow };
