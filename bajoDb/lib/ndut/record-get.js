import prepFetch from './_prep-fetch.js'
import transform from '../transform.js'

async function get ({ schema, id, options = {} } = {}) {
  const { get } = this.bajo.helper._
  const { fetch } = this.bajoExtra.helper
  const { getInfo } = this.bajoDb.helper
  const { connection } = getInfo(schema)
  const cfg = connection.options ?? {}
  const { url, opts } = await prepFetch.call(this, schema, 'get', id)
  const resp = await fetch(url, opts)
  const result = {
    data: resp[get(cfg, 'responseKey.data')]
  }
  result.data = await transform.call(this, result.data, schema)
  return result
}

export default get
