import buildFetch from '../../lib/build-fetch.js'

async function getRecord ({ schema, id, options = {} } = {}) {
  const { error } = this.bajo.helper
  const { fetch } = this.bajoExtra.helper
  const { thrownNotFound = true, dataOnly = true } = options

  const result = await buildFetch.call(this, { method: 'get', schema, id })
  try {
    const resp = await fetch(result.options)
    const rec = result.dataKey ? resp[result.dataKey] : resp
    return dataOnly ? rec : { data: rec }
  } catch (err) {
    if (thrownNotFound) throw error('Record \'%s@%s\' not found!', id, schema.name)
    else throw err
  }
}

export default getRecord
