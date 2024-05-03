async function transform (data, schema) {
  const { getInfo, callHelperOrHandler } = this.bajoDb.helper
  const { isString, get } = this.bajo.helper._
  const { connection } = getInfo(schema)
  const arr = Array.isArray(data)
  if (!arr) data = [data]
  for (const i in data) {
    let d = data[i]
    if (isString(connection.transformer)) d = await callHelperOrHandler(connection.transformer, data, schema)
    const nd = {}
    for (const k in d) {
      nd[get(connection, `fieldsMap.${k}`, k)] = d[k]
    }
    data[i] = nd
  }
  return arr ? data : data[0]
}

export default transform
