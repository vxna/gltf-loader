const compiler = require('./helpers/compiler')
const { getConfig } = require('./helpers/config')

test('options: defaults', async () => {
  const config = getConfig({ mode: 'output' }, { options: { inline: false } })
  const stats = await compiler('base.js', config)

  const buffer = stats.compilation.assets['Duck.gltf']._value
  const source = JSON.stringify(JSON.parse(buffer.toString('utf8')))

  expect(source).toMatchSnapshot()
})

test('options: inline', async () => {
  const config = getConfig({ mode: 'inline' }, { options: { inline: true } })
  const stats = await compiler('base.js', config)

  const { modules } = stats.toJson()
  const { source } = modules.find(({ id }) => /Duck\.gltf$/.test(id))

  expect(source).toMatchSnapshot()
})

test('edge case: warn if glTF-Embedded', async () => {
  const config = getConfig({ mode: 'output' }, { options: { inline: false } })
  const stats = await compiler('datauri.js', config)

  const { modules } = stats.toJson()
  const { warnings } = modules.find(({ id }) => /Duck\.gltf$/.test(id))

  expect(warnings).toBeGreaterThan(0)
})

test('edge case: error if inline with file-loader', async () => {
  const config = getConfig({ mode: 'output' }, { options: { inline: true } })
  const stats = await compiler('base.js', config)

  const { modules } = stats.toJson()
  const { errors } = modules.find(({ id }) => /Duck\.gltf$/.test(id))

  expect(errors).toBeGreaterThan(0)
})

test('edge case: error if output without file-loader', async () => {
  const config = getConfig({ mode: 'inline' }, { options: { inline: false } })
  const stats = await compiler('base.js', config)

  const { modules } = stats.toJson()
  const { errors } = modules.find(({ id }) => /Duck\.gltf$/.test(id))

  expect(errors).toBeGreaterThan(0)
})
