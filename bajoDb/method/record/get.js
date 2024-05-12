import unsupported from '../../generic/unsupported.js'
import prepFetch from '../../generic/prep-fetch.js'
import transform from '../../generic/transform.js'

async function get ({ schema, id, options = {} } = {}) {
  const { importModule } = this.bajo.helper
  const { isFunction, get } = this.bajo.helper._
  const { getInfo } = this.bajoDb.helper
  const { fetch } = this.bajoExtra.helper
  const { driver, connection } = getInfo(schema)
  const { dataOnly, responseKey } = connection.options
  const { noTransform = false } = options
  const prefix = driver.provider ? `${driver.provider}:/bajoDbRestproxy` : 'bajoDbRestproxy:/bajoDb'
  const mod = await importModule(`${prefix}/lib/${driver.type}/record-get.js`)
  if (!mod) return unsupported.call(this)
  let { url, opts, ext } = await prepFetch.call(this, schema, 'get', id)
  let resp
  if (isFunction(mod)) ({ url, opts, ext, resp } = await mod.call(this, { url, opts, ext, schema, id, options }))
  if (!resp) resp = await fetch(url, opts, ext)
  const result = {
    data: dataOnly === true || (Array.isArray(dataOnly) && dataOnly.includes('get')) ? resp : resp[get(responseKey, 'data')]
  }
  if (!noTransform) result.data = await transform.call(this, result.data, schema)
  return result
}

export default get
