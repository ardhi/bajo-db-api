import factory from './_factory.js'

async function find (params = {}) {
  return await factory.call(this, 'find', params)
}

export default find
