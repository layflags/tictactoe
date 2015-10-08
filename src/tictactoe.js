import {create as createGameStore} from './game-store'
import {create as createGameView} from './game-view'

const store = createGameStore()
const view = createGameView(store)

view.render(document.body)
store.onUpdate(view.rerender)
view.onClickCell((pos) => {
  store.move(pos)
  if (store.hasWinner() && window.confirm('play again?')) {
    store.reset()
  }
})

