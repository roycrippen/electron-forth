const path = require('path');

console.log(__dirname);
let common_config = {
  node: {
    __dirname: true
  },
  mode: process.env.ENV || 'development',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: [
          /node_modules/,
          path.resolve(__dirname, "src/ui")
        ]
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
};

module.exports = [
  Object.assign({}, common_config, {
    target: 'electron-main',
    entry: {
      main: './src/main/main.ts',
    },
    devtool: '#inline-source-map',
    output: {
      filename: '[name]-bundle.js',
      path: path.resolve(__dirname, 'dist-js')
    },
  }),
  Object.assign({}, common_config, {
    target: 'electron-renderer',
    entry: {
      ui: './src/renderer/renderer.ts',
    },
    devtool: '#inline-source-map',
    output: {
      filename: '[name]-bundle.js',
      path: path.resolve(__dirname, 'dist-js')
    },
  })
]
