import generic from '../../generic/conn-sanitizer.js'

async function connSanitizer (conn) {
  const { callHelperOrHandler } = this.bajo.helper
  let newConn = await generic.call(this, conn)
  const { connSanitizer } = newConn.handler ?? {}
  if (connSanitizer) newConn = await callHelperOrHandler(connSanitizer, newConn)
  return newConn
}

export default connSanitizer
