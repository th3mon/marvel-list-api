const cheerio = require('cheerio');

function parseMovieUrl(index, cell) {
  const $anchor = cheerio.load(cell)('a');
  const href = $anchor.attr('href');
  const isMovieTitleIndex = () => index === 0;

  return isMovieTitleIndex() && href
    ? href.replace('./', '/')
    : '';
}

module.exports = parseMovieUrl;
