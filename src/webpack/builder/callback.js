const paths = require('../../paths');
const fs = require('../../utils/filesystem');
const config = require('../config');
const bytes = require('bytes');
// const server = require('./server');
const vapp = require('./vapp');
const generic = require('./generic');

// Show the stats
function showStats() {
  const stats = fs.stat(paths.getAppPath('dist/index.html'));
  process.stdout.write(
    `Final size: ${bytes.format(stats['size'], { unitSeparator: ' ' })}\r\n\n`
  );

  // Get the Applications Data Library configuration file
  let route = paths.getAppPath(
    'node_modules/@devoinc/applications-data-library/package.json'
  );
  const appsDataLibConfig = require(route);

  // Get the Applications Builder configuration file
  route = paths.getAppPath(
    'node_modules/@devoinc/applications-builder/package.json'
  );
  const appsBuilderConfig = require(route);

  // Get the Applications Builder CLI configuration file
  route = paths.getBinPath('package.json');
  const appsBuilderCliConfig = require(route);

  // Get the app configuration file
  route = paths.appConfig;
  const appConfig = require(route);

  process.stdout.write(
    `Devo Applications Builder: ${appsBuilderConfig.version} | ` +
      `Devo Applications Data Library: ${appsDataLibConfig.version} | ` +
      `Devo Applications Builder CLI: ${appsBuilderCliConfig.version}\r\n\n` +
      `Id: ${appConfig.id}\r\n` +
      `Path: ${paths.appPath}\r\n\n`
  );
}

/**
 * Do release by copying the current PRO html file
 */
function doRelease(tag) {
  // Create releases folder if not exists
  fs.createFolder(paths.releasesFolder);

  // Write the current production file to the folder
  fs.createReadStream(paths.getAppPath('dist/index.html')).pipe(
    fs.createWriteStream(paths.appReleaseFile(tag))
  );
}

// TODO check use of stats as param
module.exports = function () {
  // Clear console
  process.stdout.write('\x1B[2J\x1B[0f\u001b[0;0H');

  // Show node version
  console.log(`Node: ${process.version}`);

  // Check for continue
  if (!paths.checkTmpFiles()) return false;

  // The final bundle
  if (config.isVapp()) vapp.bundle();
  else generic.bundle();

  // Versioning releases process (Only on 'pro' mode)
  let release = config.getRelease();
  if (config.getMode() === 'pro' && release !== undefined) {
    doRelease(release);
  }

  // Show stats
  showStats();
};
