'use strict'

import { h } from 'hyperapp'
import { Switch, Route } from '@hyperapp/router'
import Lander from './Lander'
import Draw from './Draw'

const view = (state, actions) => (
  <Switch>
    <Route path='/' render={Lander} />
    <Route path='/draw' render={Draw} />
  </Switch>
)

export default view
