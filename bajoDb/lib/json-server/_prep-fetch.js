import generic from '../generic-prep-fetch.js'

function prepFetch (schema, action, id) {
  const { url, opts } = generic.call(this, schema, action, id)
  const ext = { cacheBuster: false }
  return { url, opts, ext }
}

export default prepFetch
