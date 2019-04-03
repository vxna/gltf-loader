# @vxna/gltf-loader

[![Build Status](https://travis-ci.com/vxna/gltf-loader.svg)](https://travis-ci.com/vxna/gltf-loader) [![npm](https://img.shields.io/npm/v/@vxna/gltf-loader.svg)](https://www.npmjs.com/package/@vxna/gltf-loader)

An opinionated webpack loader for [glTF](https://github.com/KhronosGroup/glTF) files and it's [resources](https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#uris).

## Warning

This loader emits warning on [glTF-Embedded](https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#gltf-basics) files because they are known to be less efficient.  
If you want self-contained files, consider [GLB file format](https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#glb-file-format-specification) instead and use it with [file-loader](https://github.com/webpack-contrib/file-loader) only.

## Options

| Name         | Type        | Default | Description                    |
| ------------ | ----------- | ------- | ------------------------------ |
| **`inline`** | `{Boolean}` | `false` | Inline glTF files into bundle  |
| **`pretty`** | `{Boolean}` | `false` | Make glTF files human readable |

## Examples

Output glTF files (whitespace is reduced by default):

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.gltf$/,
        use: ['file-loader', '@vxna/gltf-loader']
      },
      {
        test: /\.(bin|jpe?g|png)$/,
        loader: 'file-loader'
      }
    ]
  }
}
```

Inline glTF files (resources are still external):

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.gltf$/,
        loader: '@vxna/gltf-loader',
        options: { inline: true }
      },
      {
        test: /\.(bin|jpe?g|png)$/,
        loader: 'file-loader'
      }
    ]
  }
}
```

## Credits

Based on [webmanifest-loader](https://github.com/unindented/webmanifest-loader)

## License

[MIT](./LICENSE)
