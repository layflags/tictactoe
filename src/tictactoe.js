import {create as createGameStore} from './game-store'
import {create as createGameView} from './game-view'

const store = createGameStore()
const view = createGameView(store)

view.render(document.body)
view.on('click:cell', store.move)
view.on('click:restart', store.reset)

store.onUpdate(view.rerender)

