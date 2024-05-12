async function find ({ url, opts, schema, filter } = {}) {
  const sorts = []
  for (const s in filter.sort) {
    sorts.push(`${s} ${filter.sort[s] === -1 ? 'DESC' : 'ASC'}`)
  }
  if (sorts.length > 0) opts.params.sort = sorts.join(',')
  delete filter.sort
  return { url, opts }
}

export default find
