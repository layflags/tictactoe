import createEventEmitter from './event-emitter'

// Bit field constants

const EMPTY_FIELD = 0b000000000
const FILLED_FIELD = 0b111111111
const WINNER_FIELDS = [
  0b111000000,
  0b000111000,
  0b000000111,
  0b100100100,
  0b010010010,
  0b001001001,
  0b100010001,
  0b001010100
]

/**
* Creates the game engine.
*
* @return {object} The game engine
*/
export default () => {
  const {on, trigger} = createEventEmitter()

  // Internal game state
  let fields = Array(2).fill(EMPTY_FIELD)
  let activePlayer = 0

  return Object.freeze({
    getState,
    move,
    reset,
    on
  })

  function xo (pos) {
    fields[activePlayer] |= bit(pos)
  }

  function checkWinFor (player) {
    return win => (fields[player] & win) === win
  }

  function switchPlayer () {
    activePlayer = -(activePlayer - 1)
  }

  function isFieldFilled () {
    return (fields[0] ^ fields[1]) === FILLED_FIELD
  }

  function isWinnerCell (pos, player) {
    const win = WINNER_FIELDS.find(checkWinFor(player))

    return (win || false) && isset(win, pos)
  }

  function getPlayerOn (pos) {
    return [0, 1].find(player => isset(fields[player], pos))
  }

  function isTaken (pos) {
    return Number.isInteger(getPlayerOn(pos))
  }

  function getWinner () {
    return [0, 1].find(player => WINNER_FIELDS.some(checkWinFor(player)))
  }

  function hasWinner () {
    return Number.isInteger(getWinner())
  }

  function isGameOver () {
    return hasWinner() || isFieldFilled()
  }

  function getCells () {
    const isWon = hasWinner()

    return Array(9).fill().map((_, pos) => {
      const player = getPlayerOn(pos)
      const isWinner = isWon && isWinnerCell(pos, player)

      return { pos, player, isWinner }
    })
  }

  function move (pos) {
    if (isGameOver()) return false
    if (isTaken(pos)) return false

    xo(pos)
    switchPlayer()
    trigger('update', getState())

    return true
  }

  function reset () {
    fields.fill(EMPTY_FIELD)
    activePlayer = 0
    trigger('update', getState())
  }

  function getState () {
    return {
      activePlayer,
      cells: getCells(),
      winner: getWinner(),
      isGameOver: isGameOver()
    }
  }
}

// Bit field helpers

function bit (pos) {
  return Math.pow(2, pos)
}

function isset (field, pos) {
  return (field & bit(pos)) > 0
}
