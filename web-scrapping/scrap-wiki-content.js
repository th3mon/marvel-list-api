const clients = require('restify-clients');
const cheerio = require('cheerio');
const fs = require('fs');
const _ = require('lodash');

const featureFilmsSectionId = 'mwAac';
const wikiApiUrl = `https://en.wikipedia.org/api/rest_v1/page/html/Marvel_Cinematic_Universe?sections=${featureFilmsSectionId}`;
const client = clients.createJsonClient(wikiApiUrl);

const isPhaseRow = rowText => rowText.includes('Phase');
const isHeadersRow = headerColumnLength => headerColumnLength > 1;

function run() {
  client.get('', (err, req, res, obj) => {
    const html = obj[featureFilmsSectionId];
    const $ = cheerio.load(html);
    const table = $('.wikitable');
    const headers = scrapHeaders(table, $);

    const movies = [];

    table
      .find('tr')
      .filter((_, row) => !isPhaseRow($(row).text()))
      .filter((_, row) => !isHeadersRow($(row).find('th').length))
      .map((id, row) =>
        $(row).map((_, element) => {
          const movie = {
            id
          };

          $(element)
            .children()
            .map((index, movieData) => {
              movie[headers[index]] = $(movieData).text();
            });
          movies.push(movie);
        })
      );

    const moviesDto = {
      movies
    };

    writeToFileHtml(table.html());
    writeToFile(JSON.stringify(moviesDto, null, 2));
  });
}

function scrapHeaders(table, $) {
  const headers = [];

  table.find('tr:first-child th').each((i, el) => {
    const headerContent = $(el)
      .text()
      .replace(/\(s\)/, '');

    headers.push(_.kebabCase(headerContent));
  });

  return headers;
}

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

// run();

module.exports = { run, isPhaseRow };
