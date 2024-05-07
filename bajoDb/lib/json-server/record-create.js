import prepFetch from './_prep-fetch.js'
import transform from '../transform.js'

async function create ({ schema, body, options = {} } = {}) {
  const { set } = this.bajo.helper._
  const { fetch } = this.bajoExtra.helper
  const { url, opts, ext } = await prepFetch.call(this, schema, 'create')
  opts.data = body
  const resp = await fetch(url, opts, ext)
  return set({}, 'data', await transform.call(this, resp, schema))
}

export default create
