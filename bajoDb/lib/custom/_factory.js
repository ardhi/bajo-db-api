async function factory (action, params = {}) {
  let { url, opts, schema, body, options } = params
  const { callHelperOrHandler } = this.bajo.helper
  const { get, camelCase } = this.bajo.helper._
  const { getInfo } = this.bajoDb.helper
  const { connection } = getInfo(schema)
  if ((connection.disabled ?? []).includes(action)) return false
  let resp
  const sanitizer = get(connection, `handler.${camelCase(`record ${action} sanitizer`)}`)
  const fetcher = get(connection, `handler.${camelCase(`record ${action} fetcher`)}`)
  if (sanitizer) ({ url, opts } = await callHelperOrHandler(sanitizer, { url, opts, schema, body, options }))
  if (fetcher) ({ url, opts } = await callHelperOrHandler(fetcher, { url, opts, schema, body, options }))
  return { url, opts, resp }
}

export default factory
