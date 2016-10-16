import createEventEmitter from './event-emitter'

/**
* Creates the game view.
*
* @param {HTMLElement} container - The container where view is rendered
* @param {object} engine - The game engine
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

  function avatar (player) {
    if (player === null) return ''
    return player ? 'O' : 'X'
  }

  function renderCell ({ pos, player, isWinner }) {
    const classes = [
      'cell',
      isWinner ? `is-winner player${avatar(player)}` : ''
    ].join(' ')

    return `<div class="${classes}" data-pos="${pos}">${avatar(player)}</div>`
  }

  function renderMessage ({ winner, isGameOver, activePlayer }) {
    if (typeof winner === 'number') {
      const winnerAvatar = avatar(winner)
      return `<span class="player${winnerAvatar}">Player ${winnerAvatar} has won!</span>`
    }
    if (isGameOver) return 'Nobody has won!'

    const activeAvatar = avatar(activePlayer)
    return `<span class="player${activeAvatar}">It's player ${activeAvatar}'s turn!</span>`
  }

  function renderRestartBtn () {
    return '<a href="#restart" class="again" id="btnRestart">Again?</a>'
  }

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

  function render (state) {
    const { isGameOver, cells } = state

    container.innerHTML = `
      <div class="info">${renderMessage(state)} ${isGameOver ? renderRestartBtn() : ''}</div>
      <div class="field">${cells.map(renderCell).join('')}</div>
    `
  }
}

