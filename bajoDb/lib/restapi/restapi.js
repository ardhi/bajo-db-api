import path from 'path'

const subTypes = {}

async function connSanitizer (conn) {
  const { importPkg, currentLoc, importModule, fatal } = this.bajo.helper
  const fastGlob = await importPkg('fast-glob')
  const files = await fastGlob(`${currentLoc(import.meta).dir}/sub-type/*.js`)
  for (const f of files) {
    const base = path.basename(f, '.js')
    if (subTypes[base]) continue
    subTypes[base] = await importModule(f)
  }
  if (!conn.subType) conn.subType = 'generic'
  const handler = subTypes[conn.subType]
  const result = await handler.call(this, conn)
  // auth
  if (conn.auth) {
    const types = ['basic', 'bearer', 'header', 'inline']
    if (!conn.auth.type) conn.auth.type = 'bearer'
    if (!types.includes(conn.auth.type)) fatal('Only support one of these authentication type: %s', types.join(', '), conn.name)
    if (['bearer', 'header', 'inline'].includes(conn.auth.type) && !conn.auth.apiKey) fatal('\'%s@%s\' is required', 'auth.apiKey', conn.name)
    if (conn.auth.type === 'header' && !conn.auth.headerKey) fatal('\'%s@%s\' is required', 'auth.headerKey', conn.name)
    if (conn.auth.type === 'inline' && !conn.auth.inlinePattern) fatal('\'%s@%s\' is required', 'auth.inlinePattern', conn.name)
    if (conn.auth.type === 'inline' && !conn.auth.apiKey) fatal('\'%s@%s\' is required', 'auth.apiKey', conn.name)
    if (conn.auth.type === 'basic' && !(conn.auth.username && conn.auth.password)) fatal('\'%s@%s\' and \'%s@%s\' are both required', 'auth.username', 'auth.password', conn.name)
    result.auth = conn.auth
  }
  // misc
  return result
}

export default connSanitizer
