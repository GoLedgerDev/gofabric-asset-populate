import * as https from 'https';
import * as http from 'http';
import * as debug from 'debug';

import App from './App';
import { fstat } from 'fs';
import { readFileSync } from 'fs';

//import DataPost from './DataPost'


debug('ts-express:server');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';


async function main() {
  return true;
}


main();







let server;
let port;

port = normalizePort(process.env.PORT || 80);
App.set('port', port);
server = http.createServer(App);

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

function normalizePort(val: number | string): number | string | boolean {
  const port: number = typeof val === 'string' ? parseInt(val, 10) : val;
  if (isNaN(port)) return val;
  if (port >= 0) return port;
  return false;
}

function onError(error: NodeJS.ErrnoException): void {
  if (error.syscall !== 'listen') throw error;
  const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`;
  switch (error.code) {
    case 'EACCES':
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening(): void {
  const addr = server.address();
  const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`;
  debug(`Listening on ${bind}`);
  console.log("Listening ", addr.port)
}
