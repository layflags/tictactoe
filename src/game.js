import createEngine from './engine'
import createView from './view'

export default (container) => {
  const engine = createEngine()
  const view = createView(container, engine)

  view.on('click:cell', engine.move)
  view.on('click:restart', engine.reset)

  engine.on('update', view.render)
  // short for: engine.on('update', (state) => view.render(state))
}
