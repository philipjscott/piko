'use strict'

const roomMap = require('./roomMap')

function roomify (roomServer) {
  for (const roomName in roomMap) {
    roomServer.register(roomName, roomMap[roomName])
  }

  return roomServer
}

module.exports = roomify
