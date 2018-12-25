'use strict'

import { h } from 'hyperapp'

const Lander = () => (state, actions) => (
  <div>
    <h1>Piko</h1>
    <button onclick={actions.createDrawRoom}>Create a room!</button>
    <div>
      <h2>Join a room</h2>
      <button onclick={e => actions.getDrawRooms()}>Refresh</button>
      {state.drawRooms.map(room => (
        <div>
          <p>{room.roomId} - Clients: {room.clients}</p>
          <button>Join</button>
        </div>
      ))}
    </div>
  </div>
)

export default Lander
