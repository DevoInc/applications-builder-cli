const spawn = require('spawn-promise');
const git = require('simple-git')();
const paths = require('../paths');
const path = require('path');
const fs = require('../utils/filesystem');
const colors = require('colors');
const JSZip = require('jszip');

const Spinner = require('cli-spinner').Spinner;
Spinner.setDefaultSpinnerString(18);

/**
 * Step: Start
 */
function start(name, template) {
  writeSeparator();
  console.log(`Creating project '${name}' with the template '${template}'.`);
  writeSeparator();

  if (paths.checkAppFolderExists(name)) {
    // Error if exists
    console.log(colors.red(`Folder '${name}' already exists!`));
  } else {
    // Check if common template is using
    if (template == "reference"){
      clone(name, "git@github.com:DevoInc/applications-builder-example-reference.git");
    } else if (template.endsWith('.zip')){
      unpack(name, template);
    } else if (template.endsWith('.git')) {
      // Clone step
      clone(name, template);
    } else {
      console.log(colors.red(`You must specify a template. It could be a zip file or a git repository`));
    }
  }
}

/**
 * Unpack contents into a relative folder
 * @param {string} name Name of the folder
 */
function unpack(name, filename) {
  // Show success message
  const spinner = new Spinner('Unpacking template... %s');
  spinner.start();

  // Unpacking the template
  fs.createFolder(name);
  const template = fs.readFile(paths.getBinPath(filename));
  JSZip.loadAsync(template).then((zip) => {
    const firstKey = Object.keys(zip.files)[0];
    for (let filename of Object.keys(zip.files)) {
      const dstFile = path.join(
        process.cwd(),
        filename.replace(firstKey, name + path.sep)
      );
      const item = zip.files[filename];
      if (item.dir) fs.createFolder(dstFile);
      else {
        item.async('nodebuffer').then((content) => {
          fs.writeFile(dstFile, content);
        });
      }
    }

    // Show success message
    spinner.stop(true);
    console.log(colors.green('Template unpacked!'));
    writeSeparator();

    // Install dependencies step
    installDependencies(name);
  });
}

/**
 * Step: Clone template
 */
function clone(name, template) {
  // Show success message
  const spinner = new Spinner('Cloning template ' + template + '... %s');
  spinner.start();

  // Clone template silently
  git
    .silent()
    .clone(`${template}`, name)
    .exec(() => {
      // Remove .git folder
      fs.deleteFolderRecursive(paths.getAppPath(`${name}/.git`));

      // Remove package-lock.json file
      fs.deleteFile(paths.getAppPath(`${name}/package-lock.json`));

      // Show success message
      spinner.stop(true);
      console.log(colors.green('Template cloned!'));
      writeSeparator();

      // Install dependencies step
      installDependencies(name);
    });
}

/**
 * Step: Install dependencies
 */
function installDependencies(name) {
  // Install dependencies with npm
  const spinner = new Spinner('Installing dependencies ... %s');
  spinner.start();

  paths.changeAppPath(paths.getAppPath(name));
  spawn('npm', ['install']).then(
    () => {
      // Show success message
      spinner.stop(true);
      console.log(colors.green('Dependencies installed!'));
      writeSeparator();

      // Finish step
      finish(name);
    },
    (error) => console.log(error)
  );
}

/**
 * Step: finish
 */
function finish(name) {
  console.log(
    'Next steps:\r\n\r\n' + [`- cd ${name}`, `- npm ci`, `- dab-cli build dev`].join('\r\n')
  );
  writeSeparator();
  console.log(colors.green('Build something awesome!\r\n'));
}

/**
 * Write a separator on console
 */
function writeSeparator() {
  console.log(`\r\n${'*'.repeat(40)}\r\n`);
}

module.exports = function (name, options) {
  let template = options.template;

  // Start step
  start(name, template);
};
