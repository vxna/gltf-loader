/* eslint-env jest */
const compiler = require('@webpack-contrib/test-utils')
const { getConfig } = require('./config')

test('options: defaults', async () => {
  const config = getConfig({ mode: 'external' })
  const stats = await compiler('base.js', config)

  const buffer = stats.compilation.assets['Duck.gltf']._value
  const source = JSON.stringify(JSON.parse(buffer.toString('utf8')))
  expect(source).toMatchSnapshot()
})

test('options: inline', async () => {
  const config = getConfig({ mode: 'inline' }, { inline: true })
  const stats = await compiler('base.js', config)

  const { modules } = stats.toJson()
  const { source } = modules.find(({ id }) => /Duck\.gltf$/.test(id))
  expect(source).toMatchSnapshot()
})

test('edge case: warn if using datauri', async () => {
  const config = getConfig({ mode: 'external' })
  const stats = await compiler('datauri.js', config)

  const { modules } = stats.toJson()
  const { warnings } = modules.find(({ id }) => /Duck\.gltf$/.test(id))
  expect(warnings).toBeGreaterThan(0)
})

test('edge case: throw if inline with file-loader', async () => {
  const config = getConfig({ mode: 'external' }, { inline: true })
  const stats = await compiler('base.js', config)

  const { modules } = stats.toJson()
  const { failed } = modules.find(({ id }) => /Duck\.gltf$/.test(id))
  expect(failed).toBeTruthy()
})

test('edge case: throw if external without file-loader', async () => {
  const config = getConfig({ mode: 'inline' })
  const stats = await compiler('base.js', config)

  const { modules } = stats.toJson()
  const { failed } = modules.find(({ id }) => /Duck\.gltf$/.test(id))
  expect(failed).toBeTruthy()
})
