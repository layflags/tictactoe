import './tictactoe.css'

import {create as createGameStore} from './game-store'
import {create as createGameView} from './game-view'

const store = createGameStore()
const view = createGameView(store)

view.on('click:cell', store.move)
view.on('click:restart', store.reset)

document.addEventListener('DOMContentLoaded', () => {
  view.render(document.body)
  store.on('update', view.rerender)
})

