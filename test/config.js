exports.getConfig = ({ mode }, options = {}, config = {}) => {
  const loader = require.resolve('../src')

  const defaults = {
    rules: [
      {
        test: /\.gltf$/,
        use:
          mode === 'external'
            ? [
                {
                  loader: 'file-loader',
                  options: {
                    name: '[name].[ext]',
                    esModule: false
                  }
                },
                { loader, options }
              ]
            : [{ loader, options }]
      },
      {
        test: /\.(bin|png)$/,
        use: {
          loader: 'file-loader',
          options: {
            esModule: false
          }
        }
      }
    ]
  }

  return { ...defaults, ...config }
}
