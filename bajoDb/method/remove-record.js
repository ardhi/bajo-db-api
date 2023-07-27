import buildFetch from '../../lib/build-fetch.js'

async function removeRecord ({ schema, id, options = {} } = {}) {
  const { fetch } = this.bajoExtra.helper
  const result = await buildFetch.call(this, { method: 'remove', schema, id })
  const resp = await fetch(result.options)
  const rec = result.dataKey ? resp[result.dataKey] : resp
  return { old: rec }
}

export default removeRecord
