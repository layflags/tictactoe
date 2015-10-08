/**
* Creates the game store.
*
* @return {object} The game store
*/
export function create () {
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

  let fields = [0b000000000, 0b000000000]
  let activePlayer = 0
  let updateCallbacks = []

  function onUpdate (cb) {
    updateCallbacks.push(cb)
  }

  function triggerUpdate () {
    updateCallbacks.forEach((cb) => cb())
  }

  function isGameOver () {
    return hasWinner() || (fields[0] ^ fields[1]) === 0b111111111
  }

  function isTaken (pos) {
    return ((fields[0] | fields[1]) & Math.pow(2, pos)) > 0
  }

  function xo (pos) {
    fields[activePlayer] |= Math.pow(2, pos)
  }

  function getOtherPlayer () {
    return Math.abs(activePlayer - 1)
  }

  function isWinner (player) {
    return wins.some((win) => (fields[player] & win) === win)
  }

  function getWinner () {
    if (isWinner(0)) return 0
    if (isWinner(1)) return 1
    return null
  }

  function hasWinner () {
    return getWinner() !== null
  }

  function move (pos) {
    if (isGameOver()) return false
    if (isTaken(pos)) return false

    xo(pos)
    activePlayer = getOtherPlayer()
    triggerUpdate()

    return true
  }

  function isTakenBy (player, pos) {
    return (fields[player] & Math.pow(2, pos)) > 0
  }

  function reset () {
    fields.fill(0)
    activePlayer = 0
    triggerUpdate()
  }

  return Object.freeze({
    getActivePlayer () {
      return activePlayer
    },
    getOtherPlayer,
    getWinner,
    hasWinner,
    isGameOver,
    isTaken,
    isTakenBy,
    isWinner,
    move,
    onUpdate,
    reset
  })
}
