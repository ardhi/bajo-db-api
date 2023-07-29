import buildFetch from '../../../lib/build-fetch.js'

async function get ({ schema, id, options = {} } = {}) {
  const { fetch } = this.bajoExtra.helper
  const result = await buildFetch.call(this, { method: 'get', schema, id })
  const resp = await fetch(result.options)
  const rec = result.key.data ? resp[result.key.data] : resp
  return { data: rec }
}

export default get
