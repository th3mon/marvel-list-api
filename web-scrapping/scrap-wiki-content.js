const clients = require('restify-clients');
const cheerio = require('cheerio');
const fs = require('fs');
const lodash = require('lodash');

const wikiApiUrl = 'https://en.wikipedia.org';
const pageHtmlEndpointPath = '/api/rest_v1/page/html';
const featureFilmsSectionId = 'mwAac';
const client = clients.createJsonClient(wikiApiUrl);

function parseHeaders(table) {
  const headers = [];

  table.find('tr:first-child th').each((_, headerCell) => {
    const headerContent = cheerio.load(headerCell).text();

    headers.push(
      lodash
        .chain(headerContent)
        .replace(/\(s\)/, '')
        .replace(/U\.S\./, '')
        .trim()
        .camelCase()
    );
  });

  return headers;
}

const isPhaseRow = rowText => rowText.includes('Phase');
const isEmpty = row => Boolean(
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
  const data = cheerio.load(cell).text();
  const datePattern = /\d{4}-\d{2}-\d{2}/;
  const isDate = s => datePattern.test(s);
  const wikiReferencesPattern = /\[\d+\]/;

  return isDate(data)
    ? Date(datePattern.exec(data))
    : data.replace(wikiReferencesPattern, '');
}

function parseMovieData(id, row, headers) {
  const movie = { id };

  row.children().each((index, cell) => {
    const header = headers[index];
    const data = parseCellData(cell);

    movie[header] = data;
  });

  if (!movie.status) {
    movie.status = 'Released';
  }

  return movie;
}

function run() {
  client.get({
    path: `${pageHtmlEndpointPath}/Marvel_Cinematic_Universe`,
    query: {
      sections: featureFilmsSectionId
    }
  }, (err, req, res, obj) => {
    if (err) {
      console.error(err);
    }

    const html = obj[featureFilmsSectionId];
    const $ = cheerio.load(html);
    const table = $('.wikitable');
    const headers = parseHeaders(table);
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

    writeToFile(JSON.stringify({ movies }, null, 2));
  });
}

run();

module.exports = { run, isPhaseRow };
