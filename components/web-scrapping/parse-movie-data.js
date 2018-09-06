const cheerio = require('cheerio');
const lodash = require('lodash');
const parseCell = require('./parse-cell');
const parseMovieUrl = require('./parse-movie-url');

function getCells(row) {
  const $ = cheerio.load('<table></table>');
  const $table = $('table');

  $table.append(row);

  return $table.find('td, th');
}

function parseMovieData(id, row, headers) {
  const movie = { id };

  if (!row) {
    return null;
  }

  if (!headers) {
    throw Error('headers should be defined');
  }

  if (lodash.isEmpty(headers)) {
    throw Error('headers should not be empty');
  }

  getCells(row).each((index, cell) => {
    const header = headers[index];
    const data = parseCell(cell);
    const movieUrl = parseMovieUrl(index, cell);

    if (movieUrl) {
      movie.url = movieUrl;
    }

    movie[header] = data;
  });

  if (!movie.status) {
    movie.status = 'Released';
  }

  return movie;
}

module.exports = parseMovieData;
