import factory from './_factory.js'

async function update (params = {}) {
  return await factory.call(this, 'update', params)
}

export default update
