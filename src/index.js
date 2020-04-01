const vm = require('vm')
const async = require('neo-async')
const { stripIndents } = require('common-tags')
const { getOptions, isUrlRequest, urlToRequest } = require('loader-utils')

const getAssets = (loader, gltf, options = {}) => {
  return ['buffers', 'images'].reduce((memo, resource) => {
    if (Array.isArray(gltf[resource])) {
      memo.push(
        ...gltf[resource].map((asset) =>
          resolveAssets.bind(null, loader, asset, options.publicPath)
        )
      )
    }

    return memo
  }, [])
}

const resolveAssets = (loader, asset, options = {}, callback) => {
  if (isUrlRequest(asset.uri)) {
    const request = urlToRequest(asset.uri)

    loader.resolve(loader.context, request, (err, name) => {
      if (err) {
        return callback(err)
      }

      loader.addDependency(name)

      loader.loadModule(name, (err, source) => {
        if (err) {
          return callback(err)
        }

        asset.uri = runModule(source, name, options.publicPath)

        return callback()
      })
    })
  } else {
    loader.emitWarning(
      stripIndents`
        @vxna/gltf-loader:
        
        'glTF-Embedded' format is less efficient if used on the web.
        If you want self-contained files, consider using 'GLB' instead. 
        
        Read more: https://git.io/fjIak
        `
    )

    return callback()
  }
}

const runModule = (source, name, options = {}) => {
  const script = new vm.Script(source, {
    filename: name,
    displayErrors: true,
  })

  const sandbox = {
    module: {},
    __webpack_public_path__: options.publicPath || '',
  }

  script.runInNewContext(sandbox)

  return sandbox.module.exports.toString()
}

module.exports = function (source) {
  const callback = this.async()

  this.cacheable()

  const defaults = { inline: false, pretty: false }
  const options = { ...defaults, ...getOptions(this) }

  try {
    const gltf = JSON.parse(source)
    const tasks = getAssets(this, gltf, options)

    if (this.loaders.length > 1 && options.inline) {
      this.emitError(
        stripIndents`
          @vxna/gltf-loader:

          Option '{ inline: true }' can't be used in pair with 'file-loader'.

          Read more: https://git.io/fjIV6
        `
      )
    }

    if (this.loaders.length === 1 && !options.inline) {
      this.emitError(
        stripIndents`
          @vxna/gltf-loader:

          You can't output 'glTF' files with '@vxna/gltf-loader' alone. 
          Either add 'file-loader' or set option '{ inline: true }'.

          Read more: https://git.io/fjIV6
        `
      )
    }

    async.parallel(tasks, (err) => {
      if (err) {
        return callback(err)
      }

      const file = JSON.stringify(gltf, null, options.pretty ? 2 : 0)

      const result = options.inline
        ? `module.exports = ${JSON.stringify(file)}`
        : file

      return callback(null, result)
    })
  } catch (err) {
    callback(err)
  }
}
