import prepFetch from './_prep-fetch.js'
import transform from '../transform.js'
import recordGet from './record-get.js'

async function remove ({ schema, id, options = {} } = {}) {
  const { set } = this.bajo.helper._
  const { fetch } = this.bajoExtra.helper
  const oldData = await recordGet.call(this, { schema, id })
  const { url, opts, ext } = await prepFetch.call(this, schema, 'remove', id)
  await fetch(url, opts, ext)
  return set({}, 'oldData', await transform.call(this, oldData.data, schema))
}

export default remove
