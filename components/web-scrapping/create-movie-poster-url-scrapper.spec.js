const createMoviePosterUrlScrapper = require('./create-movie-poster-url-scrapper');

class FakeClient {
  get(url, callback) {
    callback(this.error, this.request, this.responce, this.object);
  }
}

const fakeClient = new FakeClient();
fakeClient.object = '<section class="some-container"><img src="//movies.com/movie-poster.png"></section>';

describe('Scrap Movie Poster URL', () => {
  let scrapMoviePosterUrl;

  beforeEach(() => {
    scrapMoviePosterUrl = createMoviePosterUrlScrapper(fakeClient);
  });

  it('should scrap movie poster url', done => {
    scrapMoviePosterUrl('movie-url-part')
      .then(imageUrl => expect(imageUrl).toBe('https://movies.com/movie-poster.png'))
      .then(done);
  });

  it('should return empty string when <img> is not present', done => {
    fakeClient.object = '<section class="some-container"></section>';

    scrapMoviePosterUrl('movie-url-part')
      .then(imageUrl => expect(imageUrl).toBe(''))
      .then(done);
  });

  it('should return empty string when movie url part is not given', done => {
    scrapMoviePosterUrl()
      .then(imageUrl => expect(imageUrl).toBe(''))
      .then(done);
  });

  it('should error occur', done => {
    fakeClient.error = 'Some Error';

    scrapMoviePosterUrl('movie-url-part')
      .catch(error => {
        expect(error).toBeDefined();
        done();
      });
  });
});
