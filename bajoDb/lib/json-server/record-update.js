import prepFetch from './_prep-fetch.js'
import transform from '../transform.js'
import recordGet from './record-get.js'

async function create ({ schema, body, id, options = {} } = {}) {
  const { fetch } = this.bajoExtra.helper
  const oldData = await recordGet.call(this, { schema, id })
  const { url, opts, ext } = await prepFetch.call(this, schema, 'update', id)
  opts.data = body
  await fetch(url, opts, ext)
  const data = await recordGet.call(this, { schema, id })
  return {
    data: await transform.call(this, data, schema),
    oldData: await transform.call(this, oldData, schema)
  }
}

export default create
