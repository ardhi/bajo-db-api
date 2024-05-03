import prepFetch from './_prep-fetch.js'
import transform from '../transform.js'

async function create ({ schema, body, id, options = {} } = {}) {
  const { get } = this.bajo.helper._
  const { fetch } = this.bajoExtra.helper
  const { getInfo } = this.bajoDb.helper
  const { connection } = getInfo(schema)
  const cfg = connection.options ?? {}
  const { url, opts } = await prepFetch.call(this, schema, 'update', id)
  opts.data = body
  const resp = await fetch(url, opts)
  const result = {
    data: resp[get(cfg, 'responseKey.data')],
    oldData: resp[get(cfg, 'responseKey.oldData')]
  }
  result.data = await transform.call(this, result.data, schema)
  result.oldData = await transform.call(this, result.oldData, schema)
  return result
}

export default create
