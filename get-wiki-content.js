const clients = require('restify-clients');
const cheerio = require('cheerio');
const fs = require('fs');
const _ = require('lodash');

const sectionId = 'mwAac';
const wikiApiUrl = `https://en.wikipedia.org/api/rest_v1/page/html/Marvel_Cinematic_Universe?sections=${sectionId}`;
const client = clients.createJsonClient(wikiApiUrl);

client.get('', (err, req, res, obj) => {
  const html = obj[sectionId];
  const $ = cheerio.load(html);
  const table = $('.wikitable');
  const headers = scrapHeaders(table, $);

  const movies = [];

  table
    .find('tr')
    .filter((index, row) => $(row).children().length > 1)
    .filter((index, row) => $(row).find('th').length < 2)
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
