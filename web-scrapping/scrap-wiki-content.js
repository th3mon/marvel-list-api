const clients = require('restify-clients');
const cheerio = require('cheerio');
const fs = require('fs');
const lodash = require('lodash');

const featureFilmsSectionId = 'mwAac';
const wikiApiUrl = `https://en.wikipedia.org/api/rest_v1/page/html/Marvel_Cinematic_Universe?sections=${featureFilmsSectionId}`;
const client = clients.createJsonClient(wikiApiUrl);

function run() {
  client.get('', (err, req, res, obj) => {
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

const isPhaseRow = rowText => rowText.includes('Phase');
const isEmpty = row =>
  Boolean(
    !cheerio
      .load(row)
      .text()
      .trim()
  );

function parseMovieData(id, row, headers) {
  const movie = { id };

  row.children().each((index, cell) => {
    const header = headers[index];
    const data = parseCellData(cell);

    movie[header] = data;
  });

  return movie;
}

function parseCellData(cell) {
  const data = cheerio.load(cell).text();
  const isDate = s => datePattern.test(s);
  const datePattern = /\d{4}-\d{2}-\d{2}/;
  const wikiReferencesPattern = /\[\d+\]/;

  return isDate(data)
    ? Date(datePattern.exec(data))
    : data.replace(wikiReferencesPattern, '');
}

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

run();

module.exports = { run, isPhaseRow };
