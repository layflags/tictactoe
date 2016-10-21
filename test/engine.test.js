import test from 'ava'

// module under test
import createEngine from '../src/engine'

test('creates an engine instance', t => {
  const subject = createEngine()

  ;['getState', 'move', 'reset', 'on'].forEach(member => {
    t.true(member in subject)
  })
})

test('starts with an empty playing field', t => {
  const initialState = createEngine().getState()

  t.deepEqual(initialState.cells.map(c => c.player), Array(9).fill())
})

test('starts with player 0', t => {
  const initialState = createEngine().getState()

  t.is(initialState.activePlayer, 0)
})

test('starts without winner', t => {
  const initialState = createEngine().getState()

  t.is(initialState.winner, undefined)
})

test('starts with an active game', t => {
  const initialState = createEngine().getState()

  t.false(initialState.isGameOver)
})
