const spawn = require('cross-spawn');
const paths = require('../paths');
const path = require('path');

module.exports = function (mode, opts) {
  if (mode === 'pro' && opts.serve) {
    console.error(`The '--serve' param is not working with the 'pro' mode.`);
    return;
  }

  let env = {
    MODE: mode,
    ANALYZE: opts.analyze ? 'true' : 'false',
    EXTERNALIZEDEP: opts.externalDeps ? 'true' : 'false',

    // Must to be passed to the child process to work on MacOS
    PATH: process.env.PATH,
  };

  let modeWebpack = {
    dev: 'development',
    pro: 'production',
    pre: 'production',
  };

  if (opts.release) {
    if (opts.release === true) env['RELEASE'] = path.basename(paths.appPath);
    else env['RELEASE'] = opts.release;
  }

  let params = [
    opts.serve ? paths.binWebpackDevServer : paths.binWebpack,
    '--progress',
    '--color',
    `--config=${paths.webpackConfig}`,
    `--mode=${modeWebpack[mode]}`,
  ];
  if (opts.serve) {
    params.push('--open');
    params.push('--color');
    params.push('--no-inline');
  }

  let proc = spawn('node', params, { env: env });

  // Passthrough data to console
  proc.stdout.pipe(process.stdout);
  proc.stderr.on('data', (data) => process.stdout.write(data));
  proc.on('close', (code) => {
    console.error(`Child process exited with code ${code}`);
  });
};
