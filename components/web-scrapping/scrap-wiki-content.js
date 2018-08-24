const clients = require('restify-clients');
const cheerio = require('cheerio');
const fs = require('fs');
const moment = require('moment');
const parseHeaders = require('./parse-movie-header');

const wikiApiUrl = 'https://en.wikipedia.org';
const pageHtmlEndpointPath = '/api/rest_v1/page/html';
const featureFilmsSectionId = 'mwAac';
const client = clients.createJsonClient(wikiApiUrl);
const stringClient = clients.createStringClient(wikiApiUrl);

const isPhaseRow = rowText => rowText.includes('Phase');
const isEmpty = row =>
  Boolean(
    !cheerio
      .load(row)
      .text()
      .trim()
  );

function writeToFileHtml(content) {
  const writeStream = fs.createWriteStream('data-from-wiki.html');

  writeStream.write('<table>');
  writeStream.write(content);
  writeStream.write('</table>');
}

function writeToFile(content) {
  const writeStream = fs.createWriteStream('data-from-wiki.json');

  writeStream.write(content);
}

function parseCellData(cell) {
  let data = cheerio.load(cell).text();
  const datePattern = /\d{4}-\d{2}-\d{2}/;
  const isDate = s => datePattern.test(s);
  const wikiReferencesPattern = /\[\d+\]/;
  const parseDate = date => moment(date.match(datePattern)[0]).format();

  data = data.replace(wikiReferencesPattern, '');

  return isDate(data)
    ? parseDate(data)
    : data;
}

function parseMovieUrl(index, cell) {
  const $anchor = cheerio.load(cell)('a');
  const isMovieTitleIndex = () => index === 0;

  return isMovieTitleIndex()
    ? $anchor.attr('href').replace('./', '/')
    : '';
}

function scrapMovieImageUrl(url) {
  return new Promise((resolve, reject) => {
    if (url) {
      stringClient.get(
        {
          path: `${pageHtmlEndpointPath}${url}`
        },
        (err, req, res, obj) => {
          if (err) {
            console.error(err);

            reject(err);
          }

          const $ = cheerio.load(obj);
          const image = $('img[src*="poster"]');
          const src = image.attr('src');
          const protocol = 'https';

          resolve(`${protocol}:${src}`);
        }
      );
    } else {
      resolve('');
    }
  });
}

function parseMovieData(id, row, headers) {
  const movie = { id };

  row.children().each((index, cell) => {
    const header = headers[index];
    const data = parseCellData(cell);
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

const getHeaders = $headers => {
  const headersTexts = [];

  $headers.each((_, headerCell) =>
    headersTexts.push(cheerio.load(headerCell).text()));

  console.log(parseHeaders);
  return parseHeaders(headersTexts);
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
        .filter((_, row) => !isEmpty(row))
        .each((id, row) => movies.push(parseMovieData(id, $(row), headers)));

      writeToFileHtml(
        cheerio
          .load(html)('.wikitable')
          .html()
      );

      resolve(movies);
    }
  ));
}

function run() {
  let moviesLength = -1;
  let counter = 0;
  const scrappedData = [];
  let progress = 0;

  return new Promise(resolve => {
    scrapMoviesData().then(movies => {
      moviesLength = movies.length;

      movies.forEach(movie => {
        scrapMovieImageUrl(movie.url).then(imageUrl => {
          scrappedData[movie.id] = Object.assign(movie, { imageUrl });

          counter += 1;

          progress = counter === 0
            ? counter
            : parseInt((counter / moviesLength) * 100, 10);

          console.log(`${progress}%`);
        });
      });
    });

    const interval = setInterval(() => {
      if (moviesLength === counter) {
        clearInterval(interval);

        writeToFile(JSON.stringify({ movies: scrappedData }, null, 2));

        resolve(console.log('done!'));
      }
    }, 100);
  });
}

run();

module.exports = { run, isPhaseRow };