const port = 8084;

module.exports = {
  name: 'MarvelAPI',
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || port,
  base_url: process.env.BASE_URL || `http://localhost:${port}`,
  wikiApi: {
    url: 'https://en.wikipedia.org/wiki/Marvel_Cinematic_Universe#Feature_films'
  },
  data: {
    wiki: '.data/data-from-wiki.json'
  }
};
