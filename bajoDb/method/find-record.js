import buildFetch from '../../lib/build-fetch.js'

async function findRecord ({ schema, filter = {}, options = {} } = {}) {
  const { fetch } = this.bajoExtra.helper
  const { prepPagination } = this.bajoDb.helper
  const { limit, page, query, sort } = await prepPagination(filter, schema)
  // const criteria = query ? query.toJSON() : {}
  const result = await buildFetch.call(this, { method: 'find', schema })
  const resp = await fetch(result.options)
  const results = result.key.data ? resp[result.key.data] : resp
  return { data: results, page, limit, count: resp[result.key.count], pages: resp[result.key.pages] }
}

export default findRecord
