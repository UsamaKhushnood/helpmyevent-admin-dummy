const target = new EventTarget()

const on = (event, handler) => {
  const listener = (e) => handler(e.detail)
  target.addEventListener(event, listener)
  return () => target.removeEventListener(event, listener)
}

const off = (event, handler) => {
  target.removeEventListener(event, handler)
}

const emit = (event, payload) => {
  target.dispatchEvent(new CustomEvent(event, { detail: payload }))
}

export default {
  on,
  off,
  emit
}

