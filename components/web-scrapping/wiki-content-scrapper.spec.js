const createWikiContentScrapper = require('./wiki-content-scrapper');

describe('Scrap Wiki Content', () => {
  const imageUrl = '/movie-image-url.png';
  const scrapMoviePosterUrlMock = jest.fn().mockResolvedValue(imageUrl);
  let movies = [];
  let scrapMoviesDataMock = jest.fn().mockResolvedValue(movies);
  let writeToFileMock = jest.fn();
  let wikiContentScrapper = createWikiContentScrapper(
    scrapMoviesDataMock,
    scrapMoviePosterUrlMock,
    writeToFileMock
  );

  beforeEach(() => {
    movies = [
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

    scrapMoviesDataMock = jest.fn().mockResolvedValue(movies);
    writeToFileMock = jest.fn();
    wikiContentScrapper = createWikiContentScrapper(
      scrapMoviesDataMock,
      scrapMoviePosterUrlMock,
      writeToFileMock
    );
  });

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
        expect(expectedMovies).toHaveLength(movies.length))
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

  it('should all movies url scrapped', done => {
    wikiContentScrapper()
      .then(() =>
        expect(scrapMoviePosterUrlMock).toHaveBeenCalledTimes(movies.length))
      .then(done);
  });

  it('should write scrapped movies data to file', done => {
    wikiContentScrapper()
      .then(() => expect(writeToFileMock).toHaveBeenCalled())
      .then(done);
  });

  it('should file writer call with proper data', done => {
    wikiContentScrapper()
      .then(() =>
        expect(writeToFileMock).toBeCalledWith(
          JSON.stringify({ movies }, null, 2)
        ))
      .then(done);
  });

  it('should not write to file when there is no data', done => {
    const emptyMoviesData = [];
    scrapMoviesDataMock = jest.fn().mockResolvedValue(emptyMoviesData);
    wikiContentScrapper = createWikiContentScrapper(
      scrapMoviesDataMock,
      scrapMoviePosterUrlMock,
      writeToFileMock
    );

    wikiContentScrapper()
      .then(() => expect(writeToFileMock).not.toHaveBeenCalled())
      .then(done);
  });
});
