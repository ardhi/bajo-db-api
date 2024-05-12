function mapFields (data, conn, reverse) {
  const { get, invert } = this.bajo.helper._
  const fm = invert(conn.fieldsMap)
  const newData = {}
  for (const key in data) {
    const nkey = get(reverse ? fm.fieldsMap : conn.fieldsMap, key, key)
    newData[nkey] = data[key]
  }
  return newData
}

async function transform (data, schema, reverse) {
  const { getInfo, callHelperOrHandler } = this.bajoDb.helper
  const { isString } = this.bajo.helper._
  const { connection } = getInfo(schema)
  const arr = Array.isArray(data)
  if (!arr) data = [data]
  for (const i in data) {
    let d = data[i]
    if (isString(connection.transformer)) d = await callHelperOrHandler(connection.transformer, data, schema)
    data[i] = mapFields.call(this, d, connection, reverse)
  }
  return arr ? data : data[0]
}

export default transform
