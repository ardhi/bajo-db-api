import transform from './transform.js'

async function prepFetch (schema, action, id, body) {
  const { getInfo } = this.app.bajoDb
  const { connection } = getInfo(schema)
  const conn = connection.connection
  const opts = conn.options ?? {}
  const ext = conn.extra ?? {}
  if (!conn.url[action]) throw this.error('Method \'%s@%s\' is disabled', action, schema.name)
  let [method, url] = conn.url[action].split(':')
  url = `${conn.url.base}/${url}`.replace('{collName}', schema.collName)
  if (body) opts.body = await transform.call(this, body, schema, true)
  if (id) url = url.replace('{id}', id)
  opts.method = method.toLowerCase()
  opts.headers = opts.headers ?? {}
  opts.params = opts.params ?? {}
  switch (conn.auth) {
    case 'basic': opts.auth = { username: conn.username, password: conn.password }; break
    case 'apiKey': opts.headers.Authorization = `Bearer ${conn.apiKey}`; break
    case 'jwt': opts.headers.Authorizarion = `Bearer ${conn.jwt}`; break
  }
  return { url, opts, ext }
}

export default prepFetch
