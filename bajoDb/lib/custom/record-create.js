import factory from './_factory.js'

async function create (params = {}) {
  return await factory.call(this, 'create', params)
}

export default create
