const cheerio = require('cheerio');
const { parseDate, isDate } = require('./date-utils');

function parseCell(cell) {
  // let data = cheerio.load(cell).text();
  const wikiReferencesPattern = /\[\d+\]/g;
  const newLineOrCarriageReturnPattern = /\n|\r/g;
  const twoOrMoreSpacesPattern = /\s{2,}/g;

  const data = cell
    .replace('and', 'and ')
    .replace(wikiReferencesPattern, '')
    .trim()
    .replace(newLineOrCarriageReturnPattern, '')
    .replace(twoOrMoreSpacesPattern, ' ');

  return isDate(data) ? parseDate(data) : data;
}

module.exports = parseCell;
