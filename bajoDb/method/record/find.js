import unsupported from '../../lib/unsupported.js'

async function find ({ schema, filter = {}, options = {} } = {}) {
  const { importModule } = this.bajo.helper
  const { getInfo } = this.bajoDb.helper
  const { driver } = getInfo(schema)
  const mod = await importModule(`bajoDbRestproxy:/bajoDb/lib/${driver.type}/record-find.js`)
  if (!mod) return unsupported()
  return await mod.call(this, { schema, filter, options })
}

export default find
