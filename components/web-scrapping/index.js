const clients = require('restify-clients');
const createJsonFileWriter = require('./create-json-file-writer');
const config = require('../config');
// const createMovieDataScrapper = require('./create-scrap-movies-data');
const { scrapMoviesData } = require('./create-scrap-movies-data');
const createMoviePosterUrlScrapper = require('./create-movie-poster-url-scrapper');
const createWikiContentScrapper = require('./wiki-content-scrapper');

// const scrapMoviesData = createMovieDataScrapper(
//   clients.createJsonClient(config.wikiApi.url)
// );

const scrapMoviePosterUrl = createMoviePosterUrlScrapper(
  clients.createStringClient(config.wikiApi.url)
);

function writeToFile(content) {
  const wikiDataWriter = createJsonFileWriter('data-from-wiki');

  wikiDataWriter(content);
}

const wikiContentScrapper = createWikiContentScrapper(
  scrapMoviesData,
  scrapMoviePosterUrl,
  writeToFile
);

module.exports = {
  scrap: (req, res, next) => wikiContentScrapper(req, res, next)
};
