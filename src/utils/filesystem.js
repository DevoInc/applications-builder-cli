const fs = require('fs');
const path = require('path');

/**
 * Delete folder recursively
 * @param {string}
 */
function deleteFolderRecursive(folder) {
  if (fs.existsSync(folder)) {
    fs.readdirSync(folder).forEach((file) => {
      let currentPath = path.resolve(folder, file);
      if (fs.lstatSync(currentPath).isDirectory()) {
        // recurse
        deleteFolderRecursive(currentPath);
      } else {
        // delete file
        fs.unlinkSync(currentPath);
      }
    });
    fs.rmdirSync(folder);
  }
}

/**
 * Delete file
 * @param {string}
 */
function deleteFile(file) {
  fs.unlinkSync(file);
}

/**
 * Create folder if not exists already
 * @param {folder}
 */
function createFolder(folder) {
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder);
  }
}

/**
 * Write data to file, if the parent folder not exists create it.
 * @param {string} filePath - Path to the new file
 * @param {string} content - Content to write in the new file
 */
function writeFile(filePath, content) {
  createFolder(path.dirname(filePath));
  fs.writeFileSync(filePath, content);
}

/**
 * Read a folder and return its files, by default only .JS files
 * @param {string} folder - Folder path
 * @param {RegExp} pattern - Pattern for the RegExp
 * @param {string[]}
 */
function readFolder(folder, pattern = /.*/) {
  const files = fs.readdirSync(folder);
  let res = [];
  const re = new RegExp(pattern);
  for (let file of files) {
    if (re.test(file)) {
      res.push(file);
    }
  }
  return res;
}

/**
 * Read JSON file
 * @param {string} file - Path to the file
 * @return {object}
 */
function readJSON(file) {
  const contents = fs.readFileSync(file);
  return JSON.parse(contents);
}

/**
 * Read file content
 * @param {string} file - Path to the file
 * @return {string}
 */
function readFile(file) {
  return fs.readFileSync(file);
}

module.exports = {
  deleteFolderRecursive,
  deleteFile,
  createFolder,
  writeFile,
  readFolder,
  readJSON,
  readFile,
  exists: fs.existsSync,
  stat: fs.statSync,
  createReadStream: fs.createReadStream,
  createWriteStream: fs.createWriteStream,
};
