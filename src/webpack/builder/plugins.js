const paths = require('../../paths');
const config = require('../config');

const DashboardPlugin = require('webpack-dashboard/plugin');
const WebpackNotifierPlugin = require('webpack-notifier');
const BuildCallbackPlugin = require('../plugins/BuildCallbackPlugin');
const callback = require('./callback');

const StatsWriterPlugin = require('webpack-stats-plugin').StatsWriterPlugin;
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const BundleAnalyzerPlugin =
  require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const webpack = require('webpack');
const WriteFilePlugin = require('write-file-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
module.exports = function () {
  let plugins = [];

  plugins.push(new webpack.NamedModulesPlugin());

  // Add Uglify Plugin
  if (config.isMinified()) {
    plugins.push(new OptimizeCssAssetsPlugin());
  }

  // Add dashboard plugin
  if (!config.isMinified()) {
    plugins.push(new DashboardPlugin());
  }

  // Add notifier plugin
  plugins.push(
    new WebpackNotifierPlugin({
      title: 'Devo Vertical Application',
      contentImage: paths.getImage('logo.png'),
      // skipFirstNotification: false,
      // excludeWarnings: false,
      alwaysNotify: true,
    })
  );

  // Always add stats plugin
  plugins.push(
    new StatsWriterPlugin({
      filename: 'stats.json',
    })
  );

  // Add bundler analyzer
  if (config.isAnalyze()) {
    plugins.push(new BundleAnalyzerPlugin());
  }

  // If serve is active
  // if (config.isServe()) {
  //   plugins.push(
  //     new webpack.HotModuleReplacementPlugin(),
  //     new WriteFilePlugin()
  //   );
  // }

  // Add friendly errors to webpack
  plugins.push(new FriendlyErrorsWebpackPlugin());

  // Add callback plugin
  plugins.push(new BuildCallbackPlugin(callback));

  return plugins;
};
