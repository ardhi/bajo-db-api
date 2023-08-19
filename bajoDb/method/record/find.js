import buildFetch from '../../../lib/build-fetch.js'

async function find ({ schema, filter = {}, options = {} } = {}) {
  const { fetch } = this.bajoExtra.helper
  // const { prepPagination } = this.bajoDb.helper
  // const { limit, page, query, sort } = await prepPagination(filter, schema)
  const build = await buildFetch.call(this, { method: 'find', schema })
  // const criteria = query ?? {}
  // TODO: send query
  const resp = await fetch(build.options)
  const results = build.key.data ? resp[build.key.data] : resp
  return {
    data: results,
    page: resp[build.key.page],
    limit: resp[build.key.limit],
    count: resp[build.key.count],
    pages: resp[build.key.pages]
  }
}

export default find
