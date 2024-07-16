async function factory (action, params = {}) {
  let { url, opts, schema, body, options } = params
  const { callMethodOrHandler } = this.app.bajo
  const { get, camelCase } = this.app.bajo.lib._
  const { getInfo } = this.app.bajoDb
  const { connection } = getInfo(schema)
  if ((connection.disabled ?? []).includes(action)) return false
  let resp
  const sanitizer = get(connection, `handler.${camelCase(`record ${action} sanitizer`)}`)
  const fetcher = get(connection, `handler.${camelCase(`record ${action} fetcher`)}`)
  if (sanitizer) ({ url, opts } = await callMethodOrHandler(sanitizer, { url, opts, schema, body, options }))
  if (fetcher) ({ url, opts } = await callMethodOrHandler(fetcher, { url, opts, schema, body, options }))
  return { url, opts, resp }
}

export default factory
