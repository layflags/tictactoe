import {create as createEventEmitter} from './event-emitter'

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

// Bit field helpers

function bit (pos) {
  return Math.pow(2, pos)
}

function isset (field, pos) {
  return (field & bit(pos)) > 0
}

/**
* Creates the game engine.
*
* @return {object} The game engine
*/
export function create () {
  const {on, trigger} = createEventEmitter()

  // Game state

  let fields = Array(2).fill(EMPTY_FIELD)
  let activePlayer = 0

  // Private methods

  function xo (pos) {
    fields[activePlayer] |= bit(pos)
  }

  function checkWinFor (player) {
    return (win) => (fields[player] & win) === win
  }

  function switchPlayer () {
    activePlayer = getOtherPlayer()
  }

  function isFieldFilled () {
    return (fields[0] ^ fields[1]) === FILLED_FIELD
  }

  function isWinnerCell (pos, player) {
    const win = WINNER_FIELDS.find(checkWinFor(player))

    return (win || false) && isset(win, pos)
  }

  // Public methods

  function isTakenBy (player, pos) {
    return isset(fields[player], pos)
  }

  function getPlayerOn (pos) {
    const player = [0, 1].find((player) => isTakenBy(player, pos))

    return Number.isInteger(player) ? player : null
  }

  function isTaken (pos) {
    return getPlayerOn(pos) !== null
  }

  function getActivePlayer () {
    return activePlayer
  }

  function getOtherPlayer () {
    return Math.abs(activePlayer - 1)
  }

  function isWinner (player) {
    return WINNER_FIELDS.some(checkWinFor(player))
  }

  function getWinner () {
    const player = [0, 1].find(isWinner)

    return Number.isInteger(player) ? player : null
  }

  function hasWinner () {
    return getWinner() !== null
  }

  function isGameOver () {
    return hasWinner() || isFieldFilled()
  }

  function move (pos) {
    if (isGameOver()) return false
    if (isTaken(pos)) return false

    xo(pos)
    switchPlayer()
    trigger('update')

    return true
  }

  function getCells () {
    const isWon = hasWinner()

    return Array(9).fill().map((_, pos) => {
      const player = getPlayerOn(pos)
      const isWinner = isWon && isWinnerCell(pos, player)

      return {pos, player, isWinner}
    })
  }

  function reset () {
    fields.fill(EMPTY_FIELD)
    activePlayer = 0
    trigger('update')
  }

  return Object.freeze({
    getActivePlayer,
    getOtherPlayer,
    getPlayerOn,
    getWinner,
    hasWinner,
    isGameOver,
    isTaken,
    isTakenBy,
    isWinner,
    getCells,
    move,
    on,
    reset
  })
}

