'use strict'

import listen from './drawListener'

const actions = client => ({
  getDrawRooms: drawRooms => (_, actions) => {
    if (drawRooms !== undefined) {
      return { drawRooms }
    }

    client.getAvailableRooms('draw', (rooms, err) => {
      if (err) throw err

      console.log(rooms)

      actions.getDrawRooms(rooms)
    })
  },
  updateDrawRoomInput: drawRoomInput => ({ drawRoomInput }),
  _setDrawRoom: options => (state, actions) => {
    if (state.drawRoom !== null) {
      throw new Error('Currently in room; leave to make another room!')
    }

    const room = client.join('draw', options)

    listen(room, actions)

    return { drawRoomInput: '', room }
  },
  createDrawRoom: roomName => (_, actions) => actions._setDrawRoom({ create: true, roomName }),
  joinDrawRoom: roomId => (_, actions) => actions._setDrawRoom({ roomId })
})

export default actions
