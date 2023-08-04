async function generic (conn) {
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
      conn.url[k] = `${conn.url.base}{repoName}${(conn.url[k] === '' ? '' : ('/' + conn.url[k]))}`
    }
  })
  if (!conn.idPattern) conn.idPattern = '{id}'
  return pick(conn, ['type', 'name', 'driver', 'url', 'idPattern', 'responseKey'])
}

export default generic
