import getRecord from './get-record.js'
import buildFetch from '../../lib/build-fetch.js'

async function updateRecord ({ schema, id, body, options } = {}) {
  const old = await getRecord.call(this, { schema, id })
  const result = await buildFetch.call(this, { method: 'update', schema, body, id })
  const resp = await fetch(result.options)
  return { old, new: result.dataKey ? resp[result.dataKey] : resp }
}

export default updateRecord
