const parseMovieUrl = require('./parse-movie-url');

describe('Parse Movie Url', () => {
  it('should parse url', () => {
    const cell = '<td><a href="http://move-title-url.com">Movie title</a></td>';
    const cellId = 0;

    const actual = parseMovieUrl(cellId, cell);
    const expected = 'http://move-title-url.com';

    expect(actual).toEqual(expected);
  });

  it('should NOT parse url when cell id is not 0 (zero)', () => {
    const cell = '<td><a href="http://move-title-url.com">Movie title</a></td>';
    const cellId = 5453;

    const actual = parseMovieUrl(cellId, cell);
    const expected = '';

    expect(actual).toEqual(expected);
  });

  it('should NOT parse url when cell doesn\'t have link', () => {
    const cell = '<td>Movie title</td>';
    const cellId = 0;

    const actual = parseMovieUrl(cellId, cell);
    const expected = '';

    expect(actual).toEqual(expected);
  });
});
