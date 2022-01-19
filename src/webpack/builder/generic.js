const fs = require('../../utils/filesystem');
const paths = require('../../paths');

/**
 * Combine the three files into one for LT
 * @return {string} Combined files
 */
function getCombineFiles() {
  let combined = '';

  // Bundle
  const path = paths.getAppPath('tmp/app.js');
  if (fs.exists(path)) {
    combined += `${fs.readFile(path)}`;
  }

  return combined;
}

/**
 * Bundle for generic application
 */
function bundle() {
  let combined = '';
  combined += getCombineFiles();
  fs.writeFile(paths.getAppPath('dist/index.html'), combined);
}

module.exports = {
  bundle,
};
