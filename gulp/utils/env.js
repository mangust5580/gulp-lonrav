const argv = new Set(process.argv.slice(2))

const isBuildTask = [...argv].some(a => a === 'build' || a === 'preview' || a.startsWith('build:'))
const isProdFlag = argv.has('--prod') || argv.has('-p')

export const env = {
  isProd: isBuildTask || isProdFlag,
  isDev: !(isBuildTask || isProdFlag),
}
