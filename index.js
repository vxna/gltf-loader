const vm = require('vm')
const async = require('neo-async')
const { stripIndents } = require('common-tags')
const { getOptions, isUrlRequest, urlToRequest } = require('loader-utils')

function getAssets(loaderContext, gltf, options = {}) {
  return ['buffers', 'images'].reduce((memo, resource) => {
    const resources = gltf[resource]

    if (Array.isArray(resources)) {
      memo.push(
        ...resources.map(asset =>
          resolveAssets.bind(null, loaderContext, asset, options.publicPath)
        )
      )
    }

    return memo
  }, [])
}

function resolveAssets(loaderContext, asset, options = {}, callback) {
  const { context } = loaderContext

  if (isUrlRequest(asset.uri)) {
    const request = urlToRequest(asset.uri)

    loaderContext.resolve(context, request, (err, name) => {
      if (err) {
        return callback(err)
      }

      loaderContext.addDependency(name)

      loaderContext.loadModule(name, (err, source) => {
        if (err) {
          return callback(err)
        }

        asset.uri = runModule(source, name, options.publicPath)

        return callback()
      })

      return null
    })
  } else {
    loaderContext.emitWarning(
      new Error(
        stripIndents`
        'glTF-Embedded' format is less efficient if used on the web.
        If you want self-contained format, consider 'GLB' instead. 
        
        Read more: https://git.io/fjIak
        `
      )
    )

    return callback()
  }

  return null
}

function runModule(source, name, options = {}) {
  const script = new vm.Script(source, {
    filename: name,
    displayErrors: true
  })

  const sandbox = {
    module: {},
    __webpack_public_path__: options.publicPath || ''
  }

  script.runInNewContext(sandbox)

  return sandbox.module.exports.toString()
}

module.exports = function(source) {
  const defaults = {
    inline: false,
    prettify: false
  }

  const options = { ...defaults, ...getOptions(this) }

  const callback = this.async()

  this.cacheable()

  try {
    const gltf = JSON.parse(source)
    const tasks = getAssets(this, gltf, options)

    if (this.loaders.length === 1 && !options.inline) {
      throw new Error(
        stripIndents`
        You can't output external glTF with '@vxna/gltf-loader' alone. 
        Either add 'file-loader' or set option '{ inline: true }'.

        Read more: https://git.io/fjIV6
        `
      )
    }

    if (this.loaders.length > 1 && options.inline) {
      throw new Error(
        stripIndents`
        Option '{ inline: true }' can't be used in pair with 'file-loader'.

        Read more: https://git.io/fjIV6
        `
      )
    }

    async.parallel(tasks, err => {
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
