import generic from '../generic-conn-sanitizer.js'
const keys = {
  qs: ['page:_page', 'limit:_per_page', 'sort:_sort'],
  response: ['data', 'oldData']
}

async function connSanitizer (conn) {
  conn.connection.auth = false
  const result = await generic.call(this, conn, keys)
  return result
}

export default connSanitizer
