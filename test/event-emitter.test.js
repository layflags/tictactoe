import test from 'ava'

// module under test
import createEventEmitter from '../src/event-emitter'

test('create an event emitter instance', t => {
  const subject = createEventEmitter()

  t.true('on' in subject)
  t.true('trigger' in subject)
})

test.cb('trigger event and notify all subscribers', t => {
  const subject = createEventEmitter()

  t.plan(2)
  subject.on('some:event', () => {
    t.pass('first notified')
  })
  subject.on('some:event', () => {
    t.pass('second notified')
  })
  subject.trigger('some:event')
  t.end()
})

test.cb('trigger event with data and notify subscriber', t => {
  const subject = createEventEmitter()

  subject.on('some:event', (data, ltuae) => {
    t.is(data.foo, 'bar')
    t.is(ltuae, 42)
    t.end()
  })
  subject.trigger('some:event', { foo: 'bar' }, 42)
})
