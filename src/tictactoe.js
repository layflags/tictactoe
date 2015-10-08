import {create as createGameStore} from './game-store'
import {create as createGameView} from './game-view'

const store = createGameStore()
const view = createGameView(store)

view.render(document.body)
view.onClickCell(store.move)

store.onUpdate(view.rerender)
store.onUpdate(() => {
  if (store.isGameOver() && window.confirm('play again?')) {
    store.reset()
  }
})

