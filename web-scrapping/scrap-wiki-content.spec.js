const scrapWikiContent = require('./scrap-wiki-content');

const { isPhaseRow } = scrapWikiContent;

describe('Scrap Wiki Content', () => {
  describe('isPhaseRow', () => {
    it('should be phase row', () => {
      expect(isPhaseRow('Phase One')).toBe(true);
    });

    it('should NOT be phase row', () => {
      expect(isPhaseRow('Some row data')).toBe(false);
    });
  });
});
