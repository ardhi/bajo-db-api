async function sanitizer (conn) {
  const { importPkg, fatal, isSet } = this.bajo.helper
  const { pick, each, trimEnd, trimStart, isFunction, isString } = await importPkg('lodash-es')
  if (!conn.url) fatal('\'%s@%s\' key is required', 'url', conn.name)
  if (isFunction(conn.url)) {
    conn.url = await conn.url.call(this)
  } else if (isString(conn.url)) {
    conn.url = {
      find: conn.url,
      get: false,
      create: false,
      update: false,
      remove: false
    }
  }
  each(['find', 'get', 'create', 'update', 'remove'], k => {
    if (!isSet(conn.url[k])) fatal('\'%s@%s\' key is required. Set its value to false to turn off', 'url.' + k, conn.name)
    if (conn.url[k] !== false && !conn.url[k].startsWith('http')) {
      if (!conn.url.base) fatal('\'%s@%s\' key is required', 'url.base', conn.name)
      if (!conn.url.base.startsWith('http')) fatal('Base url must starts with \'http\' protocol', conn.name)
      conn.url.base = trimEnd(conn.url.base, '/')
      conn.url[k] = trimStart(conn.url[k], '/')
      conn.url[k] = conn.url.base + (conn.url[k] === '' ? '' : ('/' + conn.url[k]))
    }
  })
  if (!conn.idPattern) conn.idPattern = '{id}'
  if (conn.auth) {
    const types = ['basic', 'bearer', 'header', 'inline']
    if (!conn.auth.type) conn.auth.type = 'bearer'
    if (!types.includes(conn.auth.base)) fatal('Only support one of these authentication type: %s', types.join(', '), conn.name)
    if (['bearer', 'header', 'inline'].includes(conn.auth.type) && !conn.auth.apiKey) fatal('\'%s@%s\' is required', 'auth.apiKey', conn.name)
    if (conn.auth.type === 'header' && !conn.auth.headerKey) fatal('\'%s@%s\' is required', 'auth.headerKey', conn.name)
    if (conn.auth.type === 'inline' && !conn.auth.inlinePattern) fatal('\'%s@%s\' is required', 'auth.inlinePattern', conn.name)
    if (conn.auth.type === 'inline' && !conn.auth.apiKey) fatal('\'%s@%s\' is required', 'auth.apiKey', conn.name)
    if (conn.auth.type === 'basic' && !(conn.auth.username && conn.auth.password)) fatal('\'%s@%s\' and \'%s@%s\' are both required', 'auth.username', 'auth.password', conn.name)
  }
  return pick(conn, ['type', 'name', 'driver', 'url', 'idPattern', 'response'])
}

export default sanitizer
