const colors = require('colors');
const filesystem = require('../utils/filesystem');
const paths = require('../paths');
const fs = require('fs');

const excludeDirs = ['src/i18n'];

/**
 * Read all locales from one folder
 * @param {string} [path="src/i18n/"] - Path to the folder
 * @return {Object} - All the locales extracted from the files
 */
function readLocales(path = 'src/i18n/') {
  let locs = {};
  let files = filesystem.readFolder(paths.getAppPath(path), /(.*(\.json))$/gm);
  for (let file of files) {
    let id = file.split('.')[0];
    if (locs[id]) {
      locs[id] = Object.assign(
        locs[id],
        filesystem.readJSON(paths.getAppPath(`${path}${file}`))
      );
    } else {
      locs[id] = filesystem.readJSON(paths.getAppPath(`${path}${file}`));
    }
  }
  return locs;
}

/**
 * Get all the source files paths for use in app
 * @param {string} folder - Folder to scan
 * @return {Array<string>} - Array of file paths
 */
function scanFolder(folder) {
  let files = [];
  let all = filesystem.readFolder(paths.getAppPath(folder));
  let re = new RegExp(/(.*(\.html))|(.*(\.js))$/);

  for (let file of all) {
    let path = folder + file;
    if (excludeDirs.includes(path)) continue;

    if (fs.lstatSync(paths.getAppPath(path)).isDirectory()) {
      files = files.concat(scanFolder(path + '/'));
    } else {
      if (re.test(file)) {
        files.push(path);
      }
    }
  }

  return files;
}

/**
 * Find strings prepare for translations on the file
 * @param {string} path - Path to the file to scan
 * @return {Object} Key/Value strings
 */
function scanFile(path) {
  let strings = new Set();
  let content = String(filesystem.readFile(paths.getAppPath(path)));
  let re = /__\(\s*['|"](([^"']|\\"|\\')*)['|"]\s*\)/gm;
  let match = re.exec(content);
  while (match != null) {
    if (match[1]) strings.add(match[1]);
    match = re.exec(content);
  }
  return strings;
}

/**
 * Compare strings and locales
 * @param {Object} gLocs - Global locales
 * @param {Object} locs - App locales
 * @param {Set<string>} strings - Set with all strings
 * @return {Object} - Results of the comparation
 */
function compare(gLocs, locs, strings) {
  let res = {
    files: {},
    tot: strings.size,
  };

  for (let lk of Object.keys(locs)) {
    let gKeys = Object.keys(gLocs[lk]);
    let keys = Object.keys(locs[lk]);
    let unused = Object.keys(locs[lk]);
    res.files[lk] = { miss: [], obs: [] };

    for (let str of strings) {
      if (!keys.includes(str)) {
        // If the str is not on the keys
        if (!gKeys.includes(str)) {
          // If the str is not on the global keys
          res.files[lk].miss.push({ lk, str });
        }
      } else {
        // If the str is in the unused keys remove
        if (unused.includes(str)) unused = unused.filter((el) => el !== str);
      }
    }

    // Show strings not used
    for (let str of unused) {
      res.files[lk].obs.push({ lk, str });
    }
  }

  return res;
}

/**
 * Show the stats of the result
 */
function showStats(res) {
  for (let lk of Object.keys(res.files)) {
    let file = res.files[lk];

    // Show all missing strings
    for (let miss of file.miss) {
      console.log(`${colors.red('[KO]')} ${miss.lk}: '${miss.str}' missing.`);
    }

    // Show all obsolete strings
    for (let obs of file.obs) {
      console.log(`${colors.yellow('[WR]')} ${obs.lk}: '${obs.str}' obsolete.`);
    }

    // Show global stats
    const tot = res.tot;
    const miss = file.miss.length;
    const obs = file.obs.length;
    const ok = tot - miss;

    const okPerc = parseInt((ok / tot) * 100);
    const missPerc = parseInt((miss / tot) * 100);

    console.log(
      `${colors.green('[OK]')} ${lk}: ` +
        `Included: ${ok}/${tot} (${okPerc}%). `.green +
        (miss > 0 ? `Missing: ${miss}/${tot} (${missPerc}%). `.red : '') +
        (obs > 0 ? `Obsolete: ${obs}.`.yellow : '')
    );
    console.log('');
  }
}

// function checkWithLocales()

module.exports = function () {
  console.log('');

  // First read the translation files
  let gLocs = readLocales(
    'node_modules/@devoinc/applications-builder/i18n/locales/'
  );
  let locs = readLocales('src/i18n/');

  // Read all the files from the source
  let files = scanFolder('src/');
  let strings = new Set();
  for (let file of files) {
    for (let str of scanFile(file)) {
      strings.add(str);
    }
  }

  // Compare strings
  console.log(`Checking locale files...`);
  let res = compare(gLocs, locs, strings);

  showStats(res);
};
