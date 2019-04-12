#!/usr/bin/env node
var WebSocketServer = require('websocket').server;
var http = require('http');

var server = http.createServer(function(request, response) {
  console.log('Received request from ' + request.url);
  response.writeHead(404);
  response.end();
});

server.listen(1337, function() {
    console.log('Server is listening on port 1337.');
});

wsServer = new WebSocketServer({
    httpServer: server,
    autoAcceptConnections: false // because security matters
});

function isAllowedOrigin(origin) {
  console.log('Connection requested from origin ' + origin);

  valid_origins = [
    'http://localhost:8080',
    '127.0.0.1',
    'null'
  ];

  if (valid_origins.indexOf(origin) != -1) {
    console.log('Connection accepted from origin ' + origin);
    return true;
  }

  console.log('Origin ' + origin + ' is not allowed.')
  return false;
}

wsServer.on('connection', function(webSocketConnection) {
  console.log('Connection started.');
});

wsServer.on('request', function(request) {

  var connection = isAllowedOrigin(request.origin) ?
    request.accept('echo-protocol', request.origin)
    : request.reject();

  connection.on('message', function(message) {

    var response = '';
    console.log('Received Message: ' + message.utf8Data);

    if (message.type === 'utf8') {

      switch (message.utf8Data) {
        case 'hei':
          response = 'Heisann';
          break;
        case 'hallo':
          response = 'Hei!';
          break;
        case 'test':
          response = 'Dårlig til å finne på eksempel meldinger du?';
          break;
        case 'nani?':
          response = 'Omae wa mou shinderu';
          break;
        default:
          response = "Du brukte ikke så lang tid på å lage meg, wtf skal jeg svare til '" +
          message.utf8Data + "'?";
      }
      connection.sendUTF(response);
    }
  });
  connection.on('close', function(reasonCode, description) {
      console.log(connection.remoteAddress + ' has been disconnected.');
  });
});
