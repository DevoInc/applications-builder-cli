const paths = require('../paths');
const { rules, extractPlugins } = require('./builder/rules')();
const plugins = require('./builder/plugins')();
const config = require('./config');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  entry: {
    app: [
      paths.getAppPath('src/app.js'),
      paths.getAppPath('src/app.scss'),
      paths.getAppPath('src/app.html')
    ]
  },
  output: {
    filename: '[name].js',
    chunkFilename: '[name].js',
    path: paths.tmpPath
  },
  externals: config.externals,
  module: {
    rules
  },
  watch: !config.isMinified(),
  watchOptions: {
    aggregateTimeout: 1000,
    poll: 1000
  },
  plugins: plugins.concat(extractPlugins),
  optimization:  config.isMinified() ? {
      minimizer:[
        new TerserPlugin({
          sourceMap: true,
          cache: true,
          parallel: true,
          terserOptions: {
            compress: {
              warnings: false,
              drop_console: true
            },
            output: {
              comments: false
            }
          }
        })
      ]
  } : {},
  resolveLoader: config.resolveLoader,
  stats: config.stats,
  devtool: config.devtool,
  performance: config.performance,
  resolve: config.resolve,
  devServer: config.devServer

};
