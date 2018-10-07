const cheerio = require('cheerio');
const config = require('../../config');
const parseHeaderCells = require('./parse-header-cells');
const parseMovieData = require('./parse-movie-data');
const isEmptyRow = require('./is-empty-row');
const isPhaseRow = require('./is-phase-row');

const { pageHtmlEndpointPath } = config.wikiApi;
const featureFilmsSectionId = 'mwAac';

const getHeaders = $headers => {
  const headersTexts = [];

  $headers.each((_, headerCell) =>
    headersTexts.push(cheerio.load(headerCell).text()));

  return parseHeaderCells(headersTexts);
};

function getRowHtml(row) {
  const $ = cheerio.load('<table></table>');
  const $table = $('table');

  $table.append(row);

  return $table.find('tr').html();
}

const createMovieDataScrapper = client => () => new Promise((resolve, reject) => client.get(
  {
    path: `${pageHtmlEndpointPath}/Marvel_Cinematic_Universe`,
    query: {
      sections: featureFilmsSectionId
    }
  },
  (error, request, response, content) => {
    if (error) {
      reject(error);
    }

    const html = content[featureFilmsSectionId];

    if (!html) {
      resolve([]);
    }

    const $ = cheerio.load(html);
    const table = $('.wikitable');
    const headers = getHeaders(table.find('tr:first-child th'));
    const movies = [];

    table
      .find('tr')
      .filter((_, row) => !isPhaseRow($(row).text()))
      .filter((_, row) => !isEmptyRow(row))
      .each((id, row) => {
        const movieData = parseMovieData(id, getRowHtml(row), headers);

        movies.push(movieData);
      });

    resolve(movies);
  }
));

module.exports = createMovieDataScrapper;
