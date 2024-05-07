import prepFetch from './_prep-fetch.js'
import transform from '../transform.js'

async function find ({ schema, filter = {}, options = {} } = {}) {
  const { get, has, isPlainObject } = this.bajo.helper._
  const { fetch } = this.bajoExtra.helper
  const { getInfo, prepPagination } = this.bajoDb.helper
  const { connection } = getInfo(schema)
  const { limit, page, skip, sort } = prepPagination({ filter, schema, options })
  filter.limit = limit
  filter.page = page
  filter.skip = skip
  filter.sort = sort
  const cfg = connection.options ?? {}
  const { url, opts } = await prepFetch.call(this, schema, 'find')
  if (options.count) opts.headers['X-Count'] = true
  if (options.rels) opts.headers['X-Rels'] = options.rels
  opts.params = opts.params ?? {}
  for (const k in cfg.qsKey) {
    if (has(filter, k)) {
      const val = isPlainObject(filter[k]) ? JSON.stringify(filter[k]) : filter[k]
      opts.params[cfg.qsKey[k]] = val
    }
  }
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
