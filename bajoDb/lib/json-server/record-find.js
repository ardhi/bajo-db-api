const ops = ['lt', 'lte', 'gt', 'gte', 'ne']

async function find ({ url, opts, ext, schema, filter = {}, options = {} } = {}) {
  const { isPlainObject } = this.bajo.helper._
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
  for (const s in filter.sort) {
    sorts.push(filter.sort[s] === -1 ? `-${s}` : s)
  }
  if (sorts.length > 0) opts.params._sort = sorts.join(',')
  delete filter.sort
  return { url, opts, ext }
}

export default find
