const restify = require('restify');
const cors = require('cors');

const server = restify.createServer();
const port = 8084;

server.name = 'MarvelAPI';

server.pre(restify.plugins.pre.userAgentConnection());
server.use(cors());

function respond(req, res, next) {
  res.send(`hello ${req.params.name}`);

  next();
}

server.get('/hello/:name', respond);
server.head('/hello/:name', respond);

server.listen(port, () => (server.url.includes('http://[::]')
  ? console.log('%s listening at %s', server.name, `http://localhost:${port}`)
  : console.log('%s listening at %s', server.name, server.url)));
