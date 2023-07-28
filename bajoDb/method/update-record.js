import getRecord from './get-record.js'
import buildFetch from '../../lib/build-fetch.js'

async function updateRecord ({ schema, id, body, options } = {}) {
  const { fetch } = this.bajoExtra.helper
  const old = await getRecord.call(this, { schema, id })
  const result = await buildFetch.call(this, { method: 'update', schema, body, id })
  const resp = await fetch(result.options)
  return { old: old.data, new: result.key.data ? resp[result.key.data] : resp }
}

export default updateRecord
