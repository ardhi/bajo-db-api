async function bajo (conn) {
  const { importPkg, fatal } = this.bajo.helper
  const { pick, each } = await importPkg('lodash-es')

  if (!conn.url) fatal('\'%s@%s\' key is required', 'url', conn.name)
  conn.disabled = conn.disabled || []
  if (conn.readonly) conn.disabled = ['create', 'update', 'remove']
  const urls = {}
  each(['create', 'find', 'get', 'update', 'remove'], m => {
    let url = conn.disabled.includes(m) ? false : `${conn.url}{collName}`
    if (url && ['get', 'update', 'remove'].includes(m)) url += '/{id}'
    urls[m] = url
  })
  conn.url = urls
  conn.idPattern = '{id}'
  conn.responseKey = {
    data: {
      find: 'data',
      get: 'data',
      create: 'data',
      update: 'data',
      remove: 'data'
    },
    count: 'count',
    pages: 'pages',
    limit: 'limit',
    page: 'page'
  }
  return pick(conn, ['type', 'name', 'driver', 'url', 'idPattern', 'responseKey'])
}

export default bajo
