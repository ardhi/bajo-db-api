import unsupported from '../../lib/unsupported.js'

async function remove ({ schema, id, options = {} } = {}) {
  const { importModule } = this.bajo.helper
  const { getInfo } = this.bajoDb.helper
  const { driver } = getInfo(schema)
  const mod = await importModule(`bajoDbRestproxy:/bajoDb/lib/${driver.type}/record-remove.js`)
  if (!mod) return unsupported.call(this)
  return await mod.call(this, { schema, id, options })
}

export default remove
