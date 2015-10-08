/**
* Creates the game view.
*
* @param {object} store - The game store
* @return {object} The game view
*/
export function create (store) {
  const {mapCells, getActivePlayer, getWinner, hasWinner, isGameOver} = store
  const clickCellCallbacks = []

  let gameContainer

  function avatar (player) {
    if (player === null) return ''
    return player ? 'O' : 'X'
  }

  function renderCell (pos, player, isWinner) {
    return `
      <div class="cell ${isWinner ? 'is-winner' : ''}" data-pos="${pos}">
        ${avatar(player)}
      </div>
    `
  }

  function renderField () {
    return `<div class="field">${mapCells(renderCell).join('')}</div>`
  }

  function renderMessage () {
    if (hasWinner()) return `Player ${avatar(getWinner())} has won!`
    if (isGameOver()) return `Nobody has won! Game over.`

    return `It's player ${avatar(getActivePlayer())}s turn!`
  }

  function renderGame (container) {
    container.innerHTML = `
      <p>${renderMessage()}</p>
      ${renderField()}
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

  function onClickCell (cb) {
    clickCellCallbacks.push(cb)
  }

  function triggerClickCell (pos) {
    clickCellCallbacks.forEach((cb) => cb(pos))
  }

  function render (container) {
    if (gameContainer) throw new Error('already rendered, use `rerender`')

    gameContainer = renderLayout(container)
    renderGame(gameContainer)

    gameContainer.addEventListener('click', (e) => {
      if (e.target.className.match(/cell/)) {
        const pos = e.target.dataset.pos

        if (pos) triggerClickCell(pos)
      }
    })
  }

  function rerender () {
    if (!gameContainer) throw new Error('nothing rendered, use `render` first')

    renderGame(gameContainer)
  }

  return Object.freeze({
    onClickCell,
    render,
    rerender
  })
}

