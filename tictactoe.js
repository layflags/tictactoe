// MODEL //////////////////////////////////

const wins = [
  0b111000000,
  0b000111000,
  0b000000111,
  0b100100100,
  0b010010010,
  0b001001001,
  0b100010001,
  0b001010100
]

let players
let activePlayer = 0
let won = false

function move (pos) {
  const mark = Math.pow(2, pos)
  const otherPlayer = Math.abs(activePlayer - 1)
  const taken = players[activePlayer] & mark || players[otherPlayer] & mark

  // update playing field
  if (!taken) players[activePlayer] |= mark

  const won = !taken && wins.some((win) => (players[activePlayer] & win) === win)

  // change player
  if (!taken && !won) activePlayer = otherPlayer

  return won
}

// VIEW ////////////////////////////////////////

function avatar (player) {
  return player ? 'O' : 'X'
}

function isTaken (player, pos) {
  return (players[player] & Math.pow(2, pos)) > 0
}

function renderCell (pos) {
  return `
    <div class="cell" data-idx="${pos}">
      ${isTaken(0, pos) && avatar(0) || isTaken(1, pos) && avatar(1) || ''}
    </div>
  `
}

function renderField () {
  const cells = [0, 1, 2, 3, 4, 5, 6, 7, 8].map(renderCell)

  return `<div class="field">${cells.join('')}</div>`
}

function renderMessage () {
  if (won) return `Player ${avatar(activePlayer)} has won!`

  return `It's Players ${avatar(activePlayer)} turn!`
}

function render () {
  document.body.innerHTML = `
    <style>
      .cell {
        width: 2em;
        height: 2em;
        border: 1px solid black;
        float: left;
        box-sizing: border-box;
      }
      .field {
        overflow: auto;
        width: 6em;
      }
    </style>
    <h1>Tic Tac Toe</h1>
    <p>${renderMessage()}</p>
    ${renderField()}
  `
}

do {
  let pos
  players = [0, 0]
  won = false
  do {
    render()
    pos = window.prompt(avatar(activePlayer) + ' pos?')
    won = pos && move(pos)
  } while (pos !== null && !won)
  render()
} while (won && window.confirm('again?'))

