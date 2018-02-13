#!/usr/bin/env node

// Log uncaughtException / unhandledRejection
require('perish');

const app = require('./environment/app'),
  {port} = require('config'),
  http = require('http');

const server = http.createServer(app);

exports.app = app;
exports.server = server;

if (!module.parent) {
  server.listen(port, function() {
    console.log(`Server listening on port:${port}`);
  });
}
