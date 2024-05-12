function unsupported () {
  const { error } = this.bajo.helper
  throw error('Unsupported method/feature')
}

export default unsupported
