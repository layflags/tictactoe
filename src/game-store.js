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
  let winner = null
  let updateCallbacks = []

  function onUpdate (cb) {
    updateCallbacks.push(cb)
  }

  function triggerUpdate () {
    updateCallbacks.forEach((cb) => cb())
  }

  function move (pos) {
    const mark = Math.pow(2, pos)
    const otherPlayer = Math.abs(activePlayer - 1)
    const taken = fields[activePlayer] & mark || fields[otherPlayer] & mark

    let won = false

    // update playing field
    if (!taken) fields[activePlayer] |= mark

    // compute winner
    won = !taken && wins.some((win) => (fields[activePlayer] & win) === win)
    if (won) winner = activePlayer

    // change player
    if (!taken && !won) activePlayer = otherPlayer

    triggerUpdate()
  }

  function isTakenBy (player, pos) {
    return (fields[player] & Math.pow(2, pos)) > 0
  }

  function reset () {
    fields.fill(0)
    activePlayer = 0
    winner = null
    triggerUpdate()
  }

  return Object.freeze({
    move,
    isTakenBy,
    onUpdate,
    reset,
    getActivePlayer () {
      return activePlayer
    },
    getWinner () {
      return winner
    },
    hasWinner () {
      return winner !== null
    }
  })
}
