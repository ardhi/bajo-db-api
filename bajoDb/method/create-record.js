import buildFetch from '../../lib/build-fetch.js'

async function createRecord ({ schema, body, options = {} } = {}) {
  const { fetch } = this.bajoExtra.helper
  const result = await buildFetch.call(this, { method: 'create', schema, body })
  const resp = await fetch(result.options)
  const rec = result.dataKey ? resp[result.dataKey] : resp
  return { data: rec }
}

export default createRecord
