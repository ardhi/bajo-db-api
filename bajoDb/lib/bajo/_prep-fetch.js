import generic from '../generic-prep-fetch.js'

function prepFetch (schema, action, id) {
  const { getInfo } = this.bajoDb.helper
  const { url, opts } = generic.call(this, schema, action, id)
  const { connection } = getInfo(schema)
  const conn = connection.connection
  switch (conn.auth) {
    case 'basic': opts.auth = { username: conn.username, password: conn.password }; break
    case 'apiKey': opts.headers.Authorization = `Bearer ${conn.apiKey}`; break
    case 'jwt': opts.headers.Authorizarion = `Bearer ${conn.jwt}`; break
  }
  return { url, opts }
}

export default prepFetch
