const parseHeaderCells = require('./parse-header-cells');

describe('Parse Header Cell', () => {
  it('should parse to camel case', () => {
    const headers = [
      'The Hulk',
      'Batman',
      'Once upon a time'
    ];

    const actual = parseHeaderCells(headers);
    const expected = [
      'theHulk',
      'batman',
      'onceUponATime'
    ];

    expect(actual).toEqual(expected);
  });

  it('should remove "(s)" string', () => {
    const headers = [
      'director(s)',
      'screenwriter(s)',
      'producer(s)'
    ];

    const actual = parseHeaderCells(headers);
    const expected = [
      'director',
      'screenwriter',
      'producer'
    ];

    expect(actual).toEqual(expected);
  });

  it('should remove "U.S." string', () => {
    const headers = ['U.S. release date'];

    const actual = parseHeaderCells(headers);
    const expected = ['releaseDate'];

    expect(actual).toEqual(expected);
  });

  it('should trim values', () => {
    const headers = [
      '    The Hulk   ',
      '     Batman   ',
      '    Once upon a time   ',
      'Shogun'
    ];

    const actual = parseHeaderCells(headers);
    const expected = [
      'theHulk',
      'batman',
      'onceUponATime',
      'shogun'
    ];

    expect(actual).toEqual(expected);
  });
});
