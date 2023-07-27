const verbs = {
  create: 'POST',
  find: 'GET',
  get: 'GET',
  update: 'PUT',
  remove: 'DELETE'
}

async function buildFetch ({ schema, method, id, body, verb, opts = {} } = {}) {
  const { error, importPkg } = this.bajo.helper
  const { get, set, pick, merge } = await importPkg('lodash-es')
  const { getInfo } = this.bajoDb.helper
  const { connection } = await getInfo(schema)

  const options = merge({ method: verb || verbs[method] }, opts)
  let url = connection.url[method]
  if (!url) throw error('Method \'%s\' is disabled', method + 'Record')
  if (['update', 'get', 'remove'].includes(method)) url = url.replaceAll(connection.idPattern, id)
  if (['create', 'update'].includes(method)) options.data = body
  const auth = get(connection, 'auth.type')
  if (auth === 'inline') url = url.replaceAll(get(connection, 'auth.inlinePattern'), get(connection, 'auth.apiKey'))
  else if (auth === 'basic') options.auth = pick(connection.auth, ['username', 'password'])
  else if (auth === 'bearer') options.headers = merge({}, opts.headers, { Authorization: 'Bearer ' + get(connection, 'auth.apiKey') })
  else if (auth === 'header') options.headers = merge({}, opts.headers, set({}, get(connection, 'auth.headerKey'), get(connection, 'auth.apiKey')))
  options.url = url
  const key = {
    data: get(connection, 'response.dataKey.' + method),
    count: get(connection, 'response.countKey'),
    pages: get(connection, 'response.pagesKey')
  }
  return { options, connection, key }
}

export default buildFetch
