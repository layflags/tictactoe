import test from 'ava'

// module under test
import createEventEmitter from '../src/event-emitter'

test('creating an event emitter', t => {
  const subject = createEventEmitter()

  t.true('on' in subject)
  t.true('trigger' in subject)
})

