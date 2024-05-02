import prepFetch from './prep-fetch.js'

async function create ({ schema, id, options = {} } = {}) {
  const { get } = this.bajo.helper._
  const { fetch } = this.bajoExtra.helper
  const { getInfo } = this.bajoDb.helper
  const { connection } = getInfo(schema)
  const cfg = connection.options ?? {}
  const { url, opts } = await prepFetch.call(this, schema, 'remove', id)
  const resp = await fetch(url, opts)
  return {
    oldData: resp[get(cfg, 'responseKey.oldData')]
  }
}

export default create
