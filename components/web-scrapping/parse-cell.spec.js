const moment = require('moment');
const parseCell = require('./parse-cell');

describe('Parse Cell', () => {
  it('should parse text from cell', () => {
    const cell = '<td>Some Data</td>';


    const actual = parseCell(cell);
    const expected = 'Some Data';

    expect(actual).toEqual(expected);
  });

  it('should parse date', () => {
    const cell = '<td>May 2, 2008 (2008-05-02)</td>';

    const actual = parseCell(cell);
    const expected = moment('2008-05-02').format();

    expect(actual).toEqual(expected);
  });

  it('should remove wiki reference', () => {
    const cell = '<td>Some Data[123]</td>';

    const actual = parseCell(cell);
    const expected = 'Some Data';

    expect(actual).toEqual(expected);
  });
});
