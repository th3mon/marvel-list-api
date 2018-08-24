const lodash = require('lodash');

const parseCellHeader = cellHeader =>
  lodash
    .chain(cellHeader)
    .replace(/\(s\)/, '')
    .replace(/U\.S\./, '')
    .trim()
    .camelCase()
    .value();

const parseHeaders = headers => headers.map(header => parseCellHeader(header));

module.exports = parseHeaders;
