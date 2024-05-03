import generic from '../generic-conn-sanitizer.js'
const keys = {
  qs: ['bbox', 'query:q', 'page', 'skip:offset', 'limit:pageSize', 'sort'],
  response: ['data', 'oldData', 'page', 'count:total', 'pages:totalPages']
}

async function connSanitizer (conn) {
  const result = await generic.call(this, conn, keys)
  return result
}

export default connSanitizer
