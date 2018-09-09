const createWikiContentScrapper = require('./scrap-wiki-content');

const movies = [
  {
    id: 0,
    title: 'Iron Man'
  },
  {
    id: 1,
    film: 'The Incredible Hulk'
  },
  {
    id: 2,
    film: 'Iron Man 2'
  }
];

const scrapMoviesDataMock = jest.fn().mockResolvedValue(movies);
const imageUrl = '';
const scrapMoviePosterUrlMock = jest.fn().mockResolvedValue(imageUrl);
const writeToFileMock = jest.fn();
const wikiContentScrapper = createWikiContentScrapper(
  scrapMoviesDataMock,
  scrapMoviePosterUrlMock,
  writeToFileMock
);

describe('Scrap Wiki Content', () => {
  it('should be defined', () => {
    expect(wikiContentScrapper).toBeDefined();
  });

  it('should be a function', () => {
    expect(typeof wikiContentScrapper).toBe('function');
  });

  it('should be a Promise', () => {
    expect(wikiContentScrapper() instanceof Promise).toBe(true);
  });

  it('should expected movies length be equal to movies length', done => {
    wikiContentScrapper()
      .then(expectedMovies => expect(expectedMovies).toHaveLength(movies.length))
      .then(done);
  });

  it('should use scrapMoviesData', done => {
    wikiContentScrapper()
      .then(() => expect(scrapMoviesDataMock).toHaveBeenCalled())
      .then(done);
  });
});
