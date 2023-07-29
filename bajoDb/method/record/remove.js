import buildFetch from '../../../lib/build-fetch.js'
import getRecord from './get.js'

async function remove ({ schema, id, options = {} } = {}) {
  const { fetch } = this.bajoExtra.helper
  const result = await buildFetch.call(this, { method: 'remove', schema, id })
  const old = await getRecord.call(this, { schema, id })
  await fetch(result.options)
  return { oldData: old.data }
}

export default remove
