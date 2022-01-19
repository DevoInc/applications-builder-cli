const fs = require('./utils/filesystem');
const path = require('path');
const dates = require('./utils/dates');

const binPath = path.dirname(__dirname);
let appPath = process.cwd();

const releasesFolder = 'releases';

/**
 * Get a path base on the app folder
 * @param {string} str - Path to resolve
 * @return {string} - Resolved path
 */
function getAppPath(str) {
  return path.resolve(appPath, str);
}

/**
 * Get the node_modules path (global and local)
 * @param {string} mod - Path to the module
 * @return {string}
 */
function getNodeModulesPath(mod) {
  // Check locally
  let route = path.resolve(binPath, 'node_modules/' + mod);
  if (fs.exists(route)) return route;

  // Check global
  route = path.resolve(binPath, '../' + mod);
  if (fs.exists(route)) return route;

  // Error to inform
  console.error(`Path '${mod}' not found!`);
  process.exit(1);
}

/**
 * Get a path base on the cli folder
 * @param {string} str - Path to resolve
 * @return {string} - Resolved path
 */
function getBinPath(str) {
    return path.resolve(binPath, str);
}

module.exports = {

  // Path of the application
  appPath: appPath,

  // Path of the CLI
  binPath: binPath,

  getBinPath,

  // Release folder
  releasesFolder: getAppPath(releasesFolder),

  // Webpack bin
  binWebpack: getNodeModulesPath('webpack/bin/webpack.js'),

  // Webpack dev server bin
  binWebpackDevServer: getNodeModulesPath(
    'webpack-dev-server/bin/webpack-dev-server.js'),

  // Webpack configuration
  webpackConfig: path.resolve(binPath, 'src/webpack/webpack.config.js'),

  // Path of the CLI node_modules
  nodeModulesPath: path.resolve(binPath, 'node_modules'),
  nodeModulesPath2: path.resolve(appPath, 'node_modules'),

  // Path of the CLI parent global node_modules
  nodeModulesParentPath: path.resolve(binPath, '../'),

  // App base folder
  getAppPath,
  tmpPath: getAppPath('tmp'), // tmp folder on app
  appConfig: getAppPath('src/config.js'), // Config file of the app
  appTmpJS: getAppPath('tmp/app.js'), // Temp JS of the app
  appTmpCSS: getAppPath('tmp/app.css'), // Path of the temp CSS
  appTmpHTML: getAppPath('tmp/app.html'), // Path of the temp HTML
  // Path of a file for release now
  appReleaseFile(tag='index') {
    return getAppPath(`${releasesFolder}/${dates.getDate()}-${tag}.html`);
  },

  // Change the current appPath
  changeAppPath(str) {
    appPath = str;
    process.chdir(appPath);
  },

  // Get path of a node_module in the CLI
  getModule(mod) {
    return getNodeModulesPath(mod);
  },

  // Get path of an asset of the CLI
  getAsset(asset) {
    return path.resolve(binPath, `src/assets/${asset}`);
  },

  // Get path of an image of the CLI
  getImage(img) {
    return path.resolve(binPath, `src/assets/img/${img}`);
  },

  // Check if exists a folder in app
  checkAppFolderExists(folder) {
    return fs.exists(getAppPath(folder));
  },

  // Checks if is temps generated in the tmp dir
  checkTmpFiles() {
    return (fs.exists(getAppPath('tmp/app.js')) &&
      fs.exists(path.resolve(appPath, 'tmp/app.css')) &&
      fs.exists(path.resolve(appPath, 'tmp/app.html')));
  }

};
