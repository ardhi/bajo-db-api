import generic from '../../generic/conn-sanitizer.js'

async function connSanitizer (conn) {
  const { callMethodOrHandler } = this.app.bajo
  let newConn = await generic.call(this, conn)
  const { connSanitizer } = newConn.handler ?? {}
  if (connSanitizer) newConn = await callMethodOrHandler(connSanitizer, newConn)
  return newConn
}

export default connSanitizer
