import unsupported from '../../lib/unsupported.js'

async function update ({ schema, id, body, options } = {}) {
  const { importModule } = this.bajo.helper
  const { getInfo } = this.bajoDb.helper
  const { driver } = getInfo(schema)
  const mod = await importModule(`bajoDbRestproxy:/bajoDb/lib/${driver.type}/record-update.js`)
  if (!mod) return unsupported()
  return await mod.call(this, { schema, id, body, options })
}

export default update
