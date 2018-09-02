const clients = require('restify-clients');
const cheerio = require('cheerio');
const config = require('../../config');
const parseHeaderCells = require('./parse-header-cells');
const parseMovieData = require('./parse-movie-data');
const isEmptyRow = require('./is-empty-row');
const isPhaseRow = require('./is-phase-row');

const { pageHtmlEndpointPath } = config.wikiApi;
const featureFilmsSectionId = 'mwAac';
const client = clients.createJsonClient(config.wikiApi.url);

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

module.exports = scrapMoviesData;
