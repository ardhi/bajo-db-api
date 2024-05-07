import unsupported from '../../lib/unsupported.js'

async function aggregate ({ schema, filter = {}, options = {} } = {}) {
  const { importModule } = this.bajo.helper
  const { getInfo } = this.bajoDb.helper
  const { driver } = getInfo(schema)
  const mod = await importModule(`bajoDbRestproxy:/bajoDb/lib/${driver.type}/stat-aggregate.js`)
  if (!mod) return unsupported.call(this)
  return await mod.call(this, { schema, filter, options })
}

export default aggregate