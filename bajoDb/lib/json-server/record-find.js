import prepFetch from './_prep-fetch.js'
import transform from '../transform.js'

const ops = ['lt', 'lte', 'gt', 'gte', 'ne']

async function find ({ schema, filter = {}, options = {} } = {}) {
  const { has, isPlainObject } = this.bajo.helper._
  const { fetch } = this.bajoExtra.helper
  const { getInfo, prepPagination } = this.bajoDb.helper
  const { connection } = getInfo(schema)
  const cfg = connection.options ?? {}
  const { url, opts, ext } = await prepFetch.call(this, schema, 'find')
  const { limit, page, sort } = await prepPagination(filter, schema)
  filter.limit = limit
  filter.page = page
  opts.params = opts.params ?? {}
  const query = filter.query ?? {}
  for (const k in query) {
    const v = query[k]
    if (isPlainObject(v)) {
      for (const k1 in v) {
        const op = k1.slice(1)
        if (!ops.includes(op)) continue
        opts.params[`${k}_${op}`] = v[k1]
      }
    } else opts.params[k] = v
  }
  const sorts = []
  for (const s in sort) {
    sorts.push(sort[s] === -1 ? `-${s}` : s)
  }
  if (sorts.length > 0) opts.params._sort = sorts.join(',')
  delete filter.sort
  for (const k in cfg.qsKey) {
    if (has(filter, k)) {
      const val = isPlainObject(filter[k]) ? JSON.stringify(filter[k]) : filter[k]
      opts.params[cfg.qsKey[k]] = val
    }
  }
  const resp = await fetch(url, opts, ext)
  const result = {
    data: resp.data,
    page: filter.page,
    limit: filter.limit
  }
  result.data = await transform.call(this, result.data, schema)
  return result
}

export default find
