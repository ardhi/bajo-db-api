import unsupported from '../../generic/unsupported.js'

async function aggregate ({ schema, filter = {}, options = {} } = {}) {
  const { importModule } = this.bajo.helper
  const { getInfo } = this.bajoDb.helper
  const { driver } = getInfo(schema)
  const prefix = driver.provider ? `${driver.provider}:/bajoDbRestproxy` : 'bajoDbRestproxy:/bajoDb'
  const mod = await importModule(`${prefix}/lib/${driver.type}/stat-aggregate.js`)
  if (!mod) return unsupported.call(this)
  return await mod.call(this, { schema, filter, options })
}

export default aggregate
