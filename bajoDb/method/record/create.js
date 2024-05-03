import unsupported from '../../lib/unsupported.js'

async function create ({ schema, body, options = {} } = {}) {
  const { importModule } = this.bajo.helper
  const { getInfo } = this.bajoDb.helper
  const { driver } = getInfo(schema)
  const mod = await importModule(`bajoDbRestproxy:/bajoDb/lib/${driver.type}/record-create.js`)
  if (!mod) return unsupported.call(this)
  return await mod.call(this, { schema, body, options })
}

export default create
