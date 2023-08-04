import path from 'path'

const subTypes = {}

const verbs = {
  create: 'POST',
  find: 'GET',
  get: 'GET',
  update: 'PUT',
  remove: 'DELETE'
}

async function buildFetch ({ schema, method, id, body, verb, opts = {} } = {}) {
  const { importPkg, error, currentLoc, importModule } = this.bajo.helper
  const { merge, cloneDeep, get, each } = await importPkg('lodash-es')
  const { getInfo } = this.bajoDb.helper
  const { connection } = await getInfo(schema)
  const options = merge({ method: verb || verbs[method] }, opts)
  const conn = cloneDeep(connection)
  const fastGlob = await importPkg('fast-glob')
  const files = await fastGlob(`${currentLoc(import.meta).dir}/build-fetch/*.js`)
  for (const f of files) {
    const base = path.basename(f, '.js')
    if (subTypes[base]) continue
    subTypes[base] = await importModule(f)
  }
  if (!conn.subType) conn.subType = 'generic'
  const handler = subTypes[conn.subType]
  let url = conn.url[method]
  if (!url) throw error('Method \'%s\' is disabled', method + 'Record')

  url = url.replace('{repoName}', schema.repoName)
  const result = await handler.call(this, { conn, schema, method, id, body, options, url })
  result.key = { data: get(conn, 'responseKey.data.' + method) }
  if (method === 'find') {
    each(['limit', 'page', 'count', 'pages'], k => {
      result.key[k] = get(conn, `responseKey.${k}`)
    })
  }
  return result
}

export default buildFetch
