/**
* Creates the game view.
*
* @param {object} store - The game store
* @return {object} The game view
*/
export function create (store) {
  const {mapCells, getActivePlayer, getWinner, hasWinner, isGameOver} = store
  const eventCallbacks = []

  let gameContainer

  function on (eventName, cb) {
    eventCallbacks.push([cb, eventName])
  }

  function trigger (eventName, ...args) {
    eventCallbacks.forEach(([cb, evtName]) => {
      if (eventName === evtName) cb(...args)
    })
  }

  function avatar (player) {
    if (player === null) return ''
    return player ? 'O' : 'X'
  }

  function renderCell (pos, player, isWinner) {
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
      <div class="field">${mapCells(renderCell).join('')}</div>
    `
  }

  function renderLayout (container) {
    const cellSize = 4

    container.innerHTML = `
      <style>
        .cell {
          width: 1em;
          height: 1em;
          border: 1px solid black;
          float: left;
          box-sizing: border-box;
          text-align: center;
          line-height: 1em;
          font-size: ${cellSize}em;
        }
        .cell.is-winner {
          background-color: lime;
        }
        .field {
          overflow: auto;
          width: ${cellSize * 3}em;
        }
      </style>

      <h1>Tic Tac Toe</h1>
      <div id="game"></div>
      `
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

