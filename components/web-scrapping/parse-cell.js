const cheerio = require('cheerio');
const moment = require('moment');

function parseCell(cell) {
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

module.exports = parseCell;
