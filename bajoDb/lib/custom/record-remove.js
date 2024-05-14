import factory from './_factory.js'

async function remove (params = {}) {
  return await factory.call(this, 'remove', params)
}

export default remove
