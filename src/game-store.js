import {create as createEventEmitter} from './event-emitter'

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

/**
* Creates the game store.
*
* @return {object} The game store
*/
export function create () {
  const {on, trigger} = createEventEmitter()

  let fields = [0b000000000, 0b000000000]
  let activePlayer = 0

  function isset (field, pos) {
    return (field & Math.pow(2, pos)) > 0
  }

  function isTakenBy (player, pos) {
    return isset(fields[player], pos)
  }

  function getPlayerOn (pos) {
    if (isTakenBy(0, pos)) return 0
    if (isTakenBy(1, pos)) return 1
    return null
  }

  function isTaken (pos) {
    return getPlayerOn(pos) !== null
  }

  function xo (pos) {
    fields[activePlayer] |= Math.pow(2, pos)
  }

  function getActivePlayer () {
    return activePlayer
  }

  function getOtherPlayer () {
    return Math.abs(activePlayer - 1)
  }

  function fnCheckWinFor (player) {
    return (win) => (fields[player] & win) === win
  }

  function isWinner (player) {
    return wins.some(fnCheckWinFor(player))
  }

  function isWinnerCell (pos, player) {
    const win = wins.find(fnCheckWinFor(player))

    return (win || false) && isset(win, pos)
  }

  function getWinner () {
    if (isWinner(0)) return 0
    if (isWinner(1)) return 1
    return null
  }

  function hasWinner () {
    return getWinner() !== null
  }

  function isFieldFilled () {
    return (fields[0] ^ fields[1]) === 0b111111111
  }

  function isGameOver () {
    return hasWinner() || isFieldFilled()
  }

  function switchPlayer () {
    activePlayer = getOtherPlayer()
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
    fields.fill(0b000000000)
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

