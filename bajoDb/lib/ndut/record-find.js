import prepFetch from './_prep-fetch.js'
import transform from '../transform.js'

async function find ({ schema, filter = {}, options = {} } = {}) {
  const { get, has, isPlainObject } = this.bajo.helper._
  const { fetch } = this.bajoExtra.helper
  const { getInfo, prepPagination } = this.bajoDb.helper
  const { connection } = getInfo(schema)
  const { limit, page, sort } = await prepPagination(filter, schema)
  filter.limit = limit
  filter.page = page
  const cfg = connection.options ?? {}
  const { url, opts } = await prepFetch.call(this, schema, 'find')
  opts.params = opts.params ?? {}
  const sorts = []
  for (const s in sort) {
    sorts.push(`${s} ${sort[s] === -1 ? 'DESC' : 'ASC'}`)
  }
  if (sorts.length > 0) opts.params.sort = sorts.join(',')
  delete filter.sort
  for (const k in cfg.qsKey) {
    if (has(filter, k)) {
      const val = isPlainObject(filter[k]) ? JSON.stringify(filter[k]) : filter[k]
      opts.params[cfg.qsKey[k]] = val
    }
  }
  console.log(sort, opts)
  const resp = await fetch(url, opts)
  const result = {
    data: resp[get(cfg, 'responseKey.data')],
    page: resp[get(cfg, 'responseKey.page')],
    limit: resp[get(cfg, 'responseKey.limit')],
    count: resp[get(cfg, 'responseKey.count')],
    pages: resp[get(cfg, 'responseKey.pages')]
  }
  result.data = await transform.call(this, result.data, schema)
  return result
}

export default find