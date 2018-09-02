const scrapMoviesData = require('./scrap-movies-data');

describe('Scrap Movies Data', () => {
  it('should be defined', () => {
    expect(scrapMoviesData).toBeDefined();
  });

  it('should be function', () => {
    expect(typeof scrapMoviesData).toEqual('function');
  });
});
