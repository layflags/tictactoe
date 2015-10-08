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

  function move (pos) {
    if (isGameOver()) return false
    if (isTaken(pos)) return false

    xo(pos)
    activePlayer = getOtherPlayer()
    triggerUpdate()

    return true
  }

  function mapCells (cb) {
    const isWon = hasWinner()

    return Array(9).fill().map((_, pos) => {
      const player = getPlayerOn(pos)

      return cb(pos, player, isWon && isWinnerCell(pos, player))
    })
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
    getPlayerOn,
    getWinner,
    hasWinner,
    isGameOver,
    isTaken,
    isTakenBy,
    isWinner,
    mapCells,
    move,
    onUpdate,
    reset
  })
}

