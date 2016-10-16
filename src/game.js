import {create as createEngine} from './engine'
import {create as createView} from './view'

const engine = createEngine()
const view = createView(engine)

view.on('click:cell', engine.move)
view.on('click:restart', engine.reset)

document.addEventListener('DOMContentLoaded', () => {
  view.render(document.body)
  engine.on('update', view.rerender)
})
