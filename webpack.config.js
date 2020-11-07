const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const packageJson = require('./package.json')
const applicationName = packageJson.applicationName

if (!applicationName) {
  throw new Error('Project is not initialized yet. You need to initialize your project with `yarn initiate`')
}

module.exports = {
  mode: 'production',
  entry: './src/bootstrap.ts',
  resolve: {
    extensions: ['.js', '.ts'],
  },
  output: {
    path: path.resolve(__dirname, `${applicationName}/www`),
  },
  plugins: [new HtmlWebpackPlugin({ template: 'index.html' })],
  module: {
    rules: [
      {
        test: /\.ts$/,
        include: [path.resolve(__dirname, 'src')],
        use: {
          loader: 'ts-loader',
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
}
