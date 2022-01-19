const paths = require('../paths');
const fs = require('../utils/filesystem');

const mode = process.env.MODE;

// Default externals
let externals = {
  jquery: 'jQuery',
  'lt-web': 'lt-web',
  moment: 'moment',
  'moment-timezone': "'moment-timezone'",
  d3: 'd3',
  washemo: /^(washemo)[\/\\].+$/,
};

/**
 * Get the mode of the bundle
 * @return {string} Mode of the bundle
 */
function getMode() {
  return mode;
}

/**
 * Check if the enviroment is to be minified
 * @return {boolean} - True if is minified
 */
function isMinified() {
  return mode === 'pre' || mode === 'pro';
}

/**
 * Check if the enviroment is for use with LT Runner
 * @return {boolean} - True if is for LT Runner
 */
function isForRunner() {
  return mode === 'dev' || mode === 'pre';
}

/**
 * Get the release tag
 * @return {string} - Get the release tag (Empty string if not defined)
 */
function getRelease() {
  return process.env.RELEASE;
}

/**
 * Check if the analizer tools are active
 * @return {boolean} - True if is active
 */
function isAnalyze() {
  return process.env.ANALYZE === 'true';
}

/**
 * Check if the bundle is for app bundle
 * @return {Boolean} True if it is for app bundle
 */
function isVapp() {
  return fs.exists(paths.appConfig);
}

/**
 * Get the externals for the bundle
 * @return {Object} Externals for the bundle
 */
function getExternals() {
  return externals;
}

module.exports = {
  isMinified,
  isForRunner,
  getMode,
  getRelease,
  isAnalyze,
  isVapp,

  // Webpack stats
  stats: {
    // assets: true,
    colors: true,
    hash: false,
    // timings: true,
    children: false,
    errorDetails: true,
    chunks: false,
    modules: false,
    reasons: false,
    version: true,
    source: false,
    publicPath: false,
  },

  // Webpack resolve
  resolve: {
    modules: [paths.nodeModulesPath2, paths.nodeModulesPath],
  },

  // Webpack devtool
  devtool: isMinified() ? false : 'eval-source-map',

  // Webpack resolveLoader
  resolveLoader: {
    modules: [paths.nodeModulesPath, paths.nodeModulesParentPath],
  },

  // Webpack externals
  externals: getExternals(),

  // Webpack performance
  performance: {
    hints: false,
  },
};
