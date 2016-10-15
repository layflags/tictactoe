import {create as createEventEmitter} from './event-emitter'

/**
* Creates the game view.
*
* @param {object} store - The game store
* @return {object} The game view
*/
export function create (store) {
  const {getCells, getActivePlayer, getWinner, hasWinner, isGameOver} = store
  const {on, trigger} = createEventEmitter()

  let gameContainer

  function avatar (player) {
    if (player === null) return ''
    return player ? 'O' : 'X'
  }

  function renderCell ({pos, player, isWinner}) {
    const classes = [
      'cell',
      isWinner ? `is-winner player${avatar(player)}` : ''
    ].join(' ')

    return `<div class="${classes}" data-pos="${pos}">${avatar(player)}</div>`
  }

  function renderMessage () {
    if (hasWinner()) {
      const winnerAvatar = avatar(getWinner())
      return `<span class="player${winnerAvatar}">Player ${winnerAvatar} has won!</span>`
    }
    if (isGameOver()) return `Nobody has won!`

    const activeAvatar = avatar(getActivePlayer())
    return `<span class="player${activeAvatar}">It's player ${activeAvatar}'s turn!</span>`
  }

  function renderRestartBtn () {
    return '<a href="#restart" class="again" id="btnRestart">Again?</a>'
  }

  function renderGame (container) {
    container.innerHTML = `
      <div class="info">${renderMessage()} ${isGameOver() ? renderRestartBtn() : ''}</div>
      <div class="field">${getCells().map(renderCell).join('')}</div>
    `
  }

  function render (container) {
    if (gameContainer) throw new Error('already rendered, use `rerender`')

    gameContainer = document.getElementById('game')
    renderGame(gameContainer)

    gameContainer.addEventListener('click', (e) => {
      // handle cell click
      if (e.target.className.match(/cell/)) {
        const pos = e.target.dataset.pos

        if (pos) trigger('click:cell', pos)
      }

      // handle restart btn click
      if (e.target.id === 'btnRestart') {
        trigger('click:restart')
        e.preventDefault()
      }
    })
  }

  function rerender () {
    if (!gameContainer) throw new Error('nothing rendered, use `render` first')

    renderGame(gameContainer)
  }

  return Object.freeze({
    on, // click:cell, click:restart
    render,
    rerender
  })
}

