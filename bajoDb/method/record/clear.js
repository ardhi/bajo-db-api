async function clear ({ schema, options = {} } = {}) {
  const { error } = this.bajo.helper
  throw error('\'%s\' is unsupported', 'recordClear')
}

export default clear
