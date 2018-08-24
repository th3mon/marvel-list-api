const isEmptyRow = require('./is-empty-row');

describe('Is Empty Row', () => {
  it('should be true', () => {
    const actual = isEmptyRow('<tr></tr>');

    expect(actual).toBe(true);
  });

  it('should to be false', () => {
    const actual = isEmptyRow('<tr><td>This row is not empty</td></tr>');

    expect(actual).toBe(false);
  });
});
