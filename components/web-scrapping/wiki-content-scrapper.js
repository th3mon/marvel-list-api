const _ = require('lodash');

const createWikiContentScrapper = (
  scrapMoviesData
  // scrapMoviePosterUrl,
  // writeToFile
) => (req, res, next) =>
  scrapMoviesData(req, res, next);
    // .then(movies =>
    //   movies.map(async movie => {
    //     const imageUrl = await scrapMoviePosterUrl(movie.url);

    //     return { ...movie, imageUrl };
    //   }))
    // .then(movies => Promise.all(movies))
    // .then(movies => {
    //   if (!_.isEmpty(movies)) {
    //     writeToFile(JSON.stringify({ movies }, null, 2));
    //   }

    //   // return movies;
    //   next(movies);
    // });

module.exports = createWikiContentScrapper;
