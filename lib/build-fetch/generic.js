async function generic ({ conn, options, schema, method, body, id, url }) {
  const { importPkg } = this.bajo.helper
  const { get, set, pick, merge } = await importPkg('lodash-es')

  if (['update', 'get', 'remove'].includes(method)) url = url.replaceAll(conn.idPattern, id)
  if (['create', 'update'].includes(method)) options.data = body
  const auth = get(conn, 'auth.type')
  if (auth === 'inline') url = url.replaceAll(get(conn, 'auth.inlinePattern'), get(conn, 'auth.apiKey'))
  else if (auth === 'basic') options.auth = pick(conn.auth, ['username', 'password'])
  else if (auth === 'bearer') options.headers = merge({}, options.headers, { Authorization: 'Bearer ' + get(conn, 'auth.apiKey') })
  else if (auth === 'header') options.headers = merge({}, options.headers, set({}, get(conn, 'auth.headerKey'), get(conn, 'auth.apiKey')))
  options.url = url
  return { options, conn }
}

export default generic
