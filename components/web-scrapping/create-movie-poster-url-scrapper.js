const cheerio = require('cheerio');
const config = require('../../config');

const createMoviePosterUrlScrapper = client => movieUrl => new Promise((resolve, reject) => {
  if (movieUrl) {
    client.get(
      {
        path: `${config.wikiApi.pageHtmlEndpointPath}${movieUrl}`
      },
      (err, req, res, obj) => {
        if (err) {
          reject(err);
        }

        const $ = cheerio.load(obj);
        const image = $('img[src*="poster"]');
        const src = image.attr('src');
        const protocol = 'https';

        resolve(src ? `${protocol}:${src}` : '');
      }
    );
  } else {
    resolve('');
  }
});

module.exports = createMoviePosterUrlScrapper;
