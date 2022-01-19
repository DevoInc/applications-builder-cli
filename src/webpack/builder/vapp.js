const fs = require('../../utils/filesystem');
const paths = require('../../paths');
const config = require('../config');

/**
 * Combine the three files into one for LT
 * @return {string} Combined files
 */
function getCombineFiles() {
  let combined = '';

  // CSS
  if (fs.exists(paths.appTmpCSS)) {
    combined += `<style>${fs.readFile(paths.appTmpCSS)}</style>`;
  }

  // HTML
  if (fs.exists(paths.appTmpHTML)) {
    combined += fs.readFile(paths.appTmpHTML);
  }

  // JS
  if (fs.exists(paths.appTmpJS)) {
    combined += `<script type="text/javascript">
      ${fs.readFile(paths.appTmpJS)}</script>`;
  }

  return combined;
}

/**
 * Add Casperables definitions to the build
 * @return {string} The casperables code
 */
function getCasperables() {
  const appConfig = require(paths.appConfig);
  let res = '';
  if (appConfig.casperables && Object.keys(appConfig.casperables).length > 0) {
    let casps = Object.values(appConfig.casperables);
    res = `<script>/* CASPERCONF -${casps.join(' -')} */</script>`;
  }
  return res;
}

/**
 * Add trigger for Devo Logger (Only on DEV and PRE)
 * @return {string} The trigger code
 */
function getTrigger() {
  const appConfig = require(paths.appConfig);
  return `<script>document.dispatchEvent(new CustomEvent('changeContainer',
    {detail: {page: 'apps/custom/${appConfig.id}'}}));</script>`;
}

/**
 * Bundle for Devo Apps
 */
function bundle() {
  let combined = '';
  combined += getCombineFiles();
  combined += getCasperables();
  if (config.isForRunner()) combined += getTrigger();
  fs.writeFile(paths.getAppPath('dist/index.html'), combined);
}

module.exports = {
  getCombineFiles,
  getCasperables,
  getTrigger,
  bundle,
};
