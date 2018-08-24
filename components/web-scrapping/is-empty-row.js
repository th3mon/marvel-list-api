const cheerio = require('cheerio');

const isEmptyRow = row =>
  Boolean(
    !cheerio
      .load(row)
      .text()
      .trim()
  );

module.exports = isEmptyRow;
