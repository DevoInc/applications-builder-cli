const spawn = require('spawn-promise');
const compareVersions = require('compare-versions');
const colors = require('colors');

/**
 * Check version and print out the comprobation
 * @param {string} name - Name to show
 * @param {string} ver - Current version of the package
 * @param {string} ver - Required version
 * @return {boolean} - Return if is pass comparation
 */
function check(
  name,
  ver = '0.1.0',
  requiredGreaterOrEqualThan = '0.1.0',
  requiredLowerThan
) {

  var compareResult;
  if(requiredLowerThan) {
    compareResult = compareVersions(ver, requiredGreaterOrEqualThan) >= 0
     && compareVersions(ver, requiredLowerThan) < 0;
  } else {
    compareResult =
      compareVersions(ver, requiredGreaterOrEqualThan) >= 0;
  }

  let compare = compareResult ? colors.green('[OK]')
    : colors.red('[KO]');

  if(requiredLowerThan) {
    process.stdout.write(
      `${compare} ${name}: ${ver} (required >=${requiredGreaterOrEqualThan} and <${requiredLowerThan})\r\n`
    );
  } else {
    process.stdout.write(
      `${compare} ${name}: ${ver} (required >=${requiredGreaterOrEqualThan})\r\n`
    );
  }

}

function showResults(vers) {
  console.log('');

  // Node Check
  check('Node', vers.node, '12.0.0', '15.0.0');

  // Git Check
  check('Git', vers.git, '1.0.0');

  // npm Check
  check('npm', vers.npm, '6.0.0');

  console.log('');
}

module.exports = function () {
  console.log('Checking requirements...');

  let vers = {
    node: process.versions.node
  };

  Promise.all([spawn('git', ['--version']), spawn('npm', ['--version'])]).then(
    (values) => {
      vers['git'] = String(values[0].toString()).split(' ')[2].trim();
      vers['npm'] = String(values[1].toString()).trim();

      showResults(vers);
    }
  );
};
