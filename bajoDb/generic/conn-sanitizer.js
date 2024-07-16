const authTypes = ['basic', 'apiKey', 'jwt']
const methods = { find: 'GET', get: 'GET', create: 'POST', update: 'PUT', remove: 'DELETE' }
const defKeys = {
  qs: ['bbox', 'bboxLatField', 'bboxLngField', 'query', 'match', 'page', 'skip', 'limit', 'sort'],
  response: ['data', 'oldData', 'page', 'count', 'pages']
}

async function connSanitizer (conn, keys) {
  if (!keys) keys = defKeys
  const { join } = this.app.bajo
  const { get, set, trimEnd, trimStart, isString, isPlainObject } = this.app.bajo.lib._
  conn.proxy = true
  conn.connection = conn.connection ?? {}
  conn.connection.url = conn.connection.url ?? {}
  if (isString(conn.connection.url)) {
    const url = {
      base: trimEnd(conn.connection.url),
      find: 'GET:{collName}',
      get: 'GET:{collName}/{id}',
      create: 'POST:{collName}',
      update: 'PUT:{collName}/{id}',
      remove: 'DELETE:{collName}/{id}'
    }
    conn.connection.url = url
  } else if (isPlainObject((conn.connection.url))) {
    if (!conn.connection.url.base) throw this.error('Base url must be provided')
    conn.connection.url.base = trimEnd(conn.connection.url.base.trim(), '/')
    for (const method in methods) {
      if (!conn.connection.url[method]) continue
      let [m, u] = conn.connection.url[method].split(':').map(item => item.trim())
      if (!u) {
        u = m
        m = methods[method]
      }
      u = trimStart(u, '/')
      if (!u.includes('{collName}')) throw this.error('Url for \'%s\' must have a \'{collName}\' pattern', method)
      if (['get', 'update', 'remove'].includes(method) && !u.includes('{id}')) throw this.error('Url for \'%s\' must have a \'{id}\' pattern', method)
      conn.connection.url[method] = `${m}:${u}`
    }
  }
  conn.connection.auth = conn.connection.auth ?? 'apiKey'
  if (conn.connection.auth !== false) {
    if (!authTypes.includes(conn.connection.auth)) throw this.error('Only support one of these: %s', join(authTypes))
    switch (conn.connection.auth) {
      case 'apiKey': if (!conn.connection.apiKey) throw this.error('Api key is missing'); break
      case 'jwt': if (!conn.connection.jwt) throw this.error('JWT is missing'); break
      case 'basic':
        if (!conn.connection.username) throw this.error('Username is missing')
        if (!conn.connection.password) throw this.error('Password is missing')
        break
    }
  }
  conn.options = conn.options ?? {}
  conn.options.dataOnly = conn.options.dataOnly ?? false
  for (const type in keys) {
    for (const key of keys[type]) {
      const [def, org] = key.split(':')
      const realKey = `${type}Key.${def}`
      const val = get(conn.options, realKey, org ?? def)
      set(conn.options, realKey, val)
    }
  }
  conn.fieldsMap = conn.fieldsMap ?? {}
  if (Array.isArray(conn.fieldsMap)) {
    const map = {}
    for (const f of conn.fieldsMap) {
      const [field, nfield] = f.split(':').map(f => f.trim())
      if (!nfield || (nfield === field)) continue
      map[field] = nfield
    }
    conn.fieldsMap = map
  }
  return conn
}

export default connSanitizer
