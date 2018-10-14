const lodash = require('lodash');

const parseHeaderCell = cellHeader =>
  lodash
    .chain(cellHeader)
    .replace(/\(s\)/, '')
    .replace(/U\.S\./, '')
    .trim()
    .camelCase()
    .value();

const parseHeaders = headers => headers.map(header => parseHeaderCell(header));

module.exports = {parseHeaders, parseHeaderCell};
