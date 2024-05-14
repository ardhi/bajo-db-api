import factory from './_factory.js'

async function get (params = {}) {
  return await factory.call(this, 'get', params)
}

export default get
