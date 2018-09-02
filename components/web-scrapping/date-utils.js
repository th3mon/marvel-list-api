const moment = require('moment');

const datePattern = /\d{4}-\d{2}-\d{2}/g;
const isDate = s => datePattern.test(s);
const parseDate = date => moment(date.match(datePattern)[0]).format();

module.exports = {
  parseDate,
  isDate
};
