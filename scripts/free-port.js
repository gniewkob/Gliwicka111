#!/usr/bin/env node
const net = require('net');

function getFreePort(start = 3001) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.listen(0, '127.0.0.1', () => {
      const { port } = server.address();
      server.close(() => resolve(port));
    });
  });
}

getFreePort().then((port) => {
  process.stdout.write(String(port));
});

