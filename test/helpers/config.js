const loader = require.resolve('../../src')

const getConfig = ({ mode }, { options }, config = {}) => {
  const defaults = {
    module: {
      rules: [
        {
          test: /\.gltf$/,
          use:
            mode === 'output'
              ? [
                  {
                    loader: 'file-loader',
                    options: {
                      name: '[name].[ext]',
                      esModule: false,
                    },
                  },
                  { loader, options },
                ]
              : [{ loader, options }],
        },
        {
          test: /\.(bin|png)$/,
          use: {
            loader: 'file-loader',
            options: {
              esModule: false,
            },
          },
        },
      ],
    },
  }

  return { ...defaults, ...config }
}

module.exports = { getConfig }
