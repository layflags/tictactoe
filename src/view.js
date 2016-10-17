import createEventEmitter from './event-emitter'

/**
* Creates the game view.
*
* @param {HTMLElement} container - The container where view is rendered
* @param {object} initialState - The game state
* @return {object} The game view
*/
export default (container, initialState) => {
  const {on, trigger} = createEventEmitter()

  container.addEventListener('click', handleClick)
  render(initialState)

  return Object.freeze({
    on, // click:cell, click:restart
    render
  })

  function handleClick (event) {
    // handle cell click
    if (event.target.className.match(/cell/)) {
      const pos = event.target.dataset.pos
      if (pos) trigger('click:cell', pos)
    }

    // handle restart btn click
    if (event.target.id === 'btnRestart') {
      trigger('click:restart')
      event.preventDefault()
    }
  }

  function renderAvatar (player) {
    switch (player) {
      case 0: return 'X'
      case 1: return 'O'
      default: return ''
    }
  }

  function renderCell ({ pos, player, isWinner }) {
    let classes = 'cell'
    let avatar = renderAvatar(player)

    if (isWinner) classes += ` is-winner player${avatar}`
    return `<div class="${classes}" data-pos="${pos}">${avatar}</div>`
  }

  function renderMessage ({ winner, isGameOver, activePlayer }) {
    let avatar

    if (Number.isInteger(winner)) {
      avatar = renderAvatar(winner)
      return `<span class="player${avatar}">Player ${avatar} has won!</span>`
    }

    if (isGameOver) return 'Nobody has won!'

    avatar = renderAvatar(activePlayer)
    return `<span class="player${avatar}">It's player ${avatar}'s turn!</span>`
  }

  function renderRestartBtn () {
    return '<a href="#restart" class="again" id="btnRestart">Again?</a>'
  }

  function render (state) {
    const { isGameOver, cells } = state
    const message = renderMessage(state)

    container.innerHTML =
     `<div class="info">${message} ${isGameOver ? renderRestartBtn() : ''}</div>
      <div class="field">${cells.map(renderCell).join('')}</div>`
  }
}
