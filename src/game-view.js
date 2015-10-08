/**
* Creates the game view.
*
* @param {object} store - The game store
* @return {object} The game view
*/
export function create (store) {
  const {isTakenBy, getActivePlayer, getWinner, hasWinner} = store
  const clickCellCallbacks = []

  let gameContainer

  function avatar (player) {
    return player ? 'O' : 'X'
  }

  function renderCell (pos) {
    return `
      <div class="cell" data-pos="${pos}">
        ${isTakenBy(0, pos) && avatar(0) || isTakenBy(1, pos) && avatar(1) || ''}
      </div>
    `
  }

  function renderField () {
    const cells = [0, 1, 2, 3, 4, 5, 6, 7, 8].map(renderCell)

    return `<div class="field">${cells.join('')}</div>`
  }

  function renderMessage () {
    if (hasWinner()) return `Player ${avatar(getWinner())} has won!`

    return `It's Players ${avatar(getActivePlayer())} turn!`
  }

  function renderGame (container) {
    container.innerHTML = `
      <p>${renderMessage()}</p>
      ${renderField()}
      `
  }

  function renderLayout (container) {
    container.innerHTML = `
      <style>
        .cell {
          width: 2em;
          height: 2em;
          border: 1px solid black;
          float: left;
          box-sizing: border-box;
          text-align: center;
          line-height: 2em;
        }
        .field {
          overflow: auto;
          width: 6em;
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
      if (e.target.className === 'cell') {
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

