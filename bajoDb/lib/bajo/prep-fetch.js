function prepFetch (schema, action, id) {
  const { error } = this.bajo.helper
  const { getInfo } = this.bajoDb.helper
  const { connection } = getInfo(schema)
  const conn = connection.connection
  const opts = conn.options ?? {}
  if (!conn.url[action]) throw error('Method \'%s@%s\' is disabled', action, schema.name)
  let [method, url] = conn.url[action].split(':')
  url = `${conn.url.base}/${url}`.replace('{collName}', schema.collName).replace('{id}', id)
  opts.method = method.toLowerCase()
  opts.headers = opts.headers ?? {}
  switch (conn.auth) {
    case 'basic': opts.auth = { username: conn.username, password: conn.password }; break
    case 'apiKey': opts.headers.Authorization = `Bearer ${conn.apiKey}`; break
    case 'jwt': opts.headers.Authorizarion = `Bearer ${conn.jwt}`; break
  }
  return { url, opts }
}

export default prepFetch
