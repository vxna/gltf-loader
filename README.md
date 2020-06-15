# @vxna/gltf-loader

[![Build Status](https://travis-ci.com/vxna/gltf-loader.svg)](https://travis-ci.com/vxna/gltf-loader) [![npm version](https://badge.fury.io/js/%40vxna%2Fglsl-loader.svg)](https://badge.fury.io/js/%40vxna%2Fgltf-loader)

An opinionated webpack loader for [glTF](https://github.com/KhronosGroup/glTF) files and it's [resources](https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#gltf-basics).

## Warning

1. Usage with `file-loader@>=5.0.0` requires `esModule: false` [option](https://github.com/webpack-contrib/file-loader#esmodule).

2. This loader emit warning on glTF files with [Data URI](https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#uris) resources because they are less efficient. If you want self-contained files, consider [GLB](https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#glb-file-format-specification) file format instead and use it with [file-loader](https://github.com/webpack-contrib/file-loader) only.

## Options

| Name         | Type        | Default | Description              |
| ------------ | ----------- | ------- | ------------------------ |
| **`inline`** | `{Boolean}` | `false` | Inline glTF into bundle  |
| **`pretty`** | `{Boolean}` | `false` | Make glTF human readable |

## Live code example

Visit [this CodeSandbox](https://codesandbox.io/s/03p6ny629v) for the full-featured example that you can download or play online.

## Usage with `file-loader@>=5.0.0`

Inline glTF into bundle (geometry/textures are external):

```js
// webpack.config.js

module.exports = {
  module: {
    rules: [
      {
        test: /\.gltf$/,
        loader: '@vxna/gltf-loader',
        options: { inline: true },
      },
      {
        test: /\.(bin|jpe?g|png)$/,
        loader: 'file-loader',
        options: { esModule: false },
      },
    ],
  },
}
```

Output glTF file (geometry/textures are external):

```js
// webpack.config.js

module.exports = {
  module: {
    rules: [
      {
        test: /\.gltf$/,
        use: [
          {
            loader: 'file-loader',
            options: { esModule: false },
          },
          '@vxna/gltf-loader',
        ],
      },
      {
        test: /\.(bin|jpe?g|png)$/,
        loader: 'file-loader',
        options: { esModule: false },
      },
    ],
  },
}
```

## Credits

Based on [webmanifest-loader](https://github.com/unindented/webmanifest-loader)

## License

[MIT](./LICENSE)
