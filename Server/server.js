
'use strict'

const express = require('express')
const http = require('http')
const WebSocket = require('ws')

const app = express()
const server = http.createServer(app);
const websocketServer = new WebSocket.Server({ server })

websocketServer.on('connection', ws => {
  ws.on('message', message => {
    websocketServer.clients.forEach(client => {
      if (client != ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    })
  })
})

server.listen(8081, () => {
  console.log('WebSocket server started on port', server.address().port);
})
