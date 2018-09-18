const restify = require('restify');
const cors = require('cors');
const config = require('./components/config');

const server = restify.createServer();
const getMovies = require('./components/movies/movies');

server.pre(restify.plugins.pre.userAgentConnection());
server.use(cors());

function respond(req, res, next) {
  res.send(`hello ${req.params.name}`);

  next();
}

server.get('/hello/:name', respond);
server.head('/hello/:name', respond);

server.get('/movies', getMovies);

server.listen(config.port, () => (server.url.includes('http://[::]')
  ? console.log('%s listening at %s', config.name, `http://localhost:${config.port}`)
  : console.log('%s listening at %s', config.name, server.url)));
