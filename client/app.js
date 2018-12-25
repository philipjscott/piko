'use strict'

import * as Colyseus from 'colyseus.js'
import { app } from 'hyperapp'
import { location } from '@hyperapp/router'
import { withLogger } from '@hyperapp/logger'

import config from '../config/default'
import state from './state'
import actions from './actions'
import view from './view'

const wsUrl = window.location.hostname === 'localhost'
  ? `ws://${window.location.hostname}:${config.app.port}`
  : `ws://${window.location.host}`
const client = new Colyseus.Client(wsUrl)
const main = withLogger(app)(state, actions(client), view, document.body)

location.subscribe(main.location)
main.getDrawRooms()
