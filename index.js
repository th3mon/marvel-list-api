const jsonServer = require('json-server');
const cors = require('cors');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const port = 8084;

server.use(cors());
server.use('/v1', router);
server.use(router);

server.listen(port, () =>
  console.log(`API Server is running at port: http://localhost:${port}`)
);
