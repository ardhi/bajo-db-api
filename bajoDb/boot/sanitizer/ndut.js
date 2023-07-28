import bajo from './bajo.js'

async function ndut (conn) {
  const result = await bajo.call(this, conn)
  result.responseKey.count = 'total'
  result.responseKey.pages = 'totalPages'
  result.responseKey.limit = 'pageSize'
  return result
}

export default ndut
