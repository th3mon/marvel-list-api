const cheerio = require('cheerio');
const lodash = require('lodash');
const parseCell = require('./parse-cell');
const parseMovieUrl = require('./parse-movie-url');

function parseMovieData(id, row, headers) {
  const movie = { id };
  const $row = cheerio.load(`<table>${row}</table>`);

  if (!row) {
    return null;
  }

  if (!headers) {
    throw Error('headers should be defined');
  }

  if (lodash.isEmpty(headers)) {
    throw Error('headers should not be empty');
  }

  $row('td, th').each((index, cell) => {
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
