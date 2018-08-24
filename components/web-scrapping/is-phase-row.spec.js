const isPhaseRow = require('./is-phase-row');

describe('Is Phase Row', () => {
  it('should be true row', () => {
    expect(isPhaseRow('Phase One')).toBe(true);
  });

  it('should NOT be phase row', () => {
    expect(isPhaseRow('Some row data')).toBe(false);
  });
});
