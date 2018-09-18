const getMovies = require('./movies');

describe('Movies', () => {
  let request;
  let response;
  let next;

  beforeEach(() => {
    request = jest.fn();
    response = {
      send: jest.fn()
    };
    next = jest.fn();
  });

  it('should be defined', () => {
    expect(getMovies).toBeDefined();
  });

  it('should be function', () => {
    expect(typeof getMovies).toBe('function');
  });

  it('should run next()', () => {
    getMovies(request, response, next);

    expect(next).toHaveBeenCalled();
  });

  it('should send data', () => {
    getMovies(request, response, next);

    expect(response.send).toHaveBeenCalledWith(expect.anything());
  });
});
