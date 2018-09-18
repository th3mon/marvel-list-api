const data = require('../../.data/data-from-wiki.json');

function getMovies(req, res, next) {
  res.send(data);

  next();
}

module.exports = getMovies;
