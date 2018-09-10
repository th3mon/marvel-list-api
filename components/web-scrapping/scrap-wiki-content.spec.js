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
const imageUrl = '/movie-image-url.png';
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

  it('should have then function', () => {
    expect(typeof wikiContentScrapper().then).toBe('function');
  });

  it('should expected movies length be equal to movies length', done => {
    wikiContentScrapper()
      .then(expectedMovies =>
        expect(expectedMovies).toHaveLength(movies.length)
      )
      .then(done);
  });

  it('should expected the first movie be equal to the first movie', done => {
    wikiContentScrapper()
      .then(expectedMovies => expect(expectedMovies[0]).toEqual(movies[0]))
      .then(done);
  });

  it('should use scrapMoviesData', done => {
    wikiContentScrapper()
      .then(() => expect(scrapMoviesDataMock).toHaveBeenCalled())
      .then(done);
  });

  it('should movies have image url', done => {
    wikiContentScrapper()
      .then(expectedMovies => expect(expectedMovies[0].imageUrl).toBe(imageUrl))
      .then(done);
  });
});
