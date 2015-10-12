export function create () {
  const eventCallbacks = []

  function on (eventName, cb) {
    eventCallbacks.push([cb, eventName])
  }

  function trigger (eventName, ...args) {
    eventCallbacks.forEach(([cb, evtName]) => {
      if (eventName === evtName) cb(...args)
    })
  }

  return Object.freeze({
    on,
    trigger
  })
}

