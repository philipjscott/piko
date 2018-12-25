'use strict'

const { Room } = require('colyseus')
const DrawState = require('./drawState')

class DrawRoom extends Room {
  onInit () {
    this.setState(new DrawState())
  }

  onJoin (client) {

  }

  onLeave (client) {

  }

  onMessage (client, data) {

  }
}

module.exports = DrawRoom
