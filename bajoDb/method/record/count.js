import buildFetch from '../../../lib/build-fetch.js'

async function count ({ schema, filter = {}, options = {} } = {}) {
  const { fetch } = this.bajoExtra.helper
  const build = await buildFetch.call(this, { method: 'find', schema })
  const resp = await fetch(build.options)
  return {
    data: resp[build.key.count] || 0
  }
}

export default count
