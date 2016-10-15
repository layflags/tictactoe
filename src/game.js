import {create as createEngine} from './engine'
import {create as createView} from './view'

const store = createEngine()
const view = createView(store)

view.on('click:cell', store.move)
view.on('click:restart', store.reset)

document.addEventListener('DOMContentLoaded', () => {
  view.render(document.body)
  store.on('update', view.rerender)
})
