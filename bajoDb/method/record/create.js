import buildFetch from '../../../lib/build-fetch.js'

async function create ({ schema, body, options = {} } = {}) {
  const { fetch } = this.bajoExtra.helper
  const result = await buildFetch.call(this, { method: 'create', schema, body })
  const resp = await fetch(result.options)
  const rec = result.key.data ? resp[result.key.data] : resp
  return { data: rec }
}

export default create
