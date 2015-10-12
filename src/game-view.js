import {create as createEventEmitter} from './event-emitter'

function appendHTML (html, container) {
  const div = document.createElement('div')

  div.innerHTML = html
  Array.from(div.childNodes).forEach((childNode) => {
    container.appendChild(childNode)
  })
}

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
    const classes = ['cell', isWinner ? 'is-winner' : ''].join(' ')

    return `<div class="${classes}" data-pos="${pos}">${avatar(player)}</div>`
  }

  function renderMessage () {
    if (hasWinner()) return `Player ${avatar(getWinner())} has won!`
    if (isGameOver()) return `Nobody has won!`

    return `It's player ${avatar(getActivePlayer())}'s turn!`
  }

  function renderRestartBtn () {
    return '<button id="btnRestart">Play again!</button>'
  }

  function renderGame (container) {
    container.innerHTML = `
      <p>${renderMessage()} ${isGameOver() ? renderRestartBtn() : ''}</p>
      <div class="field">${getCells().map(renderCell).join('')}</div>
    `
  }

  function renderLayout (container) {
    appendHTML('<h1>Tic Tac Toe</h1><div id="game"></div>', container)
    return document.getElementById('game')
  }

  function render (container) {
    if (gameContainer) throw new Error('already rendered, use `rerender`')

    gameContainer = renderLayout(container)
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

