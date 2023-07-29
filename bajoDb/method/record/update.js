import getRecord from './get.js'
import buildFetch from '../../../lib/build-fetch.js'

async function update ({ schema, id, body, options } = {}) {
  const { fetch } = this.bajoExtra.helper
  const old = await getRecord.call(this, { schema, id })
  const result = await buildFetch.call(this, { method: 'update', schema, body, id })
  const resp = await fetch(result.options)
  return { oldData: old.data, data: result.key.data ? resp[result.key.data] : resp }
}

export default update
