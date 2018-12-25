#!/usr/bin/env node

'use strict'

const config = require('config')
const roomify = require('../rooms')
const colyseus = require('colyseus')
const http = require('http')

// Add HTTP handler for heroku
const onPing = (_, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' })
  res.write('hello, world')
  res.end()
}
const onListen = port => err => {
  if (err) throw err

  console.log(`Server is listening on port ${port}`)
}

const port = process.env.PORT || config.app.port

let server
let roomServer

if (process.env.NODE_ENV !== 'production') {
  const express = require('express')
  const { monitor } = require('@colyseus/monitor')
  const app = express()

  server = http.createServer(app)
  roomServer = new colyseus.Server({ server })
  roomify(roomServer)
  app.use('/colyseus', monitor(roomServer))
} else {
  server = http.createServer(onPing)
  roomServer = new colyseus.Server({ server })
  roomify(roomServer)
}

server.listen(port, onListen(port))
