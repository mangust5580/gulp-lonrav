const argv = new Set(process.argv.slice(2))

const isBuildTask = [...argv].some(a => a === 'preview' || /^build($|:|[A-Z])/.test(a))
const isProdFlag = argv.has('--prod') || argv.has('-p')

export const env = {
  isProd: isBuildTask || isProdFlag,
  isDev: !(isBuildTask || isProdFlag),
}
