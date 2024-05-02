const authTypes = ['basic', 'apiKey', 'jwt']
const keys = {
  qs: ['bbox', 'bboxLatField', 'bboxLngField', 'query', 'match', 'page', 'skip', 'limit', 'sort'],
  response: ['data', 'oldData', 'page', 'count', 'pages']
}
const methods = { find: 'GET', get: 'GET', create: 'POST', update: 'PUT', remove: 'DELETE' }

async function connSanitizer (conn) {
  const { error, join } = this.bajo.helper
  const { set, get, trimEnd, trimStart } = this.bajo.helper._
  conn.proxy = true
  conn.connection = conn.connection ?? {}
  conn.connection.url = conn.connection.url ?? {}
  if (!conn.connection.url.base) throw error('Base url must be provided')
  conn.connection.url.base = trimEnd(conn.connection.url.base.trim(), '/')
  for (const method in methods) {
    if (!conn.connection.url[method]) continue
    let [m, u] = conn.connection.url[method].split(':').map(item => item.trim())
    if (!u) {
      u = m
      m = methods[method]
    }
    u = trimStart(u, '/')
    if (!u.includes('{collName}')) throw error('Url for \'%s\' must have a \'{collName}\' pattern', method)
    if (['get', 'update', 'remove'].includes(method) && !u.includes('{id}')) throw error('Url for \'%s\' must have a \'{id}\' pattern', method)
    conn.connection.url[method] = `${m}:${u}`
  }

  conn.connection.auth = conn.connection.auth ?? 'apiKey'
  if (conn.connection.auth !== false) {
    if (!authTypes.includes(conn.connection.auth)) throw error('Only support one of these: %s', join(authTypes))
    switch (conn.connection.auth) {
      case 'apiKey': if (!conn.connection.apiKey) throw error('Api key is missing'); break
      case 'jwt': if (!conn.connection.jwt) throw error('JWT is missing'); break
      case 'basic':
        if (!conn.connection.username) throw error('Username is missing')
        if (!conn.connection.password) throw error('Password is missing')
        break
    }
  }
  conn.options = conn.options ?? {}
  conn.options.dataOnly = conn.options.dataOnly ?? false
  for (const i in keys) {
    for (const k of keys[i]) {
      const key = `${i}Key.${k}`
      const val = get(conn.options, key, k)
      set(conn.options, key, val)
    }
  }
  return conn
}

export default connSanitizer
