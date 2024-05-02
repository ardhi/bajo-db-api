import prepFetch from './prep-fetch.js'

async function get ({ schema, id, options = {} } = {}) {
  const { get } = this.bajo.helper._
  const { fetch } = this.bajoExtra.helper
  const { getInfo } = this.bajoDb.helper
  const { connection } = getInfo(schema)
  const cfg = connection.options ?? {}
  const { url, opts } = await prepFetch.call(this, schema, 'get', id)
  const resp = await fetch(url, opts)
  return {
    data: resp[get(cfg, 'responseKey.data')]
  }
}

export default get
