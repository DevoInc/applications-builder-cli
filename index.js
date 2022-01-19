#!/usr/bin/env node
const colors = require('colors');

const program = require('commander');
const buildAction = require('./src/actions/build');
const checkAction = require('./src/actions/check');
const createAction = require('./src/actions/create');
const transAction = require('./src/actions/trans');

const path = require('path');

process.stdin.setEncoding('utf8');

const ver = require(path.resolve(__dirname, 'package.json')).version;
let execute = false;

function devoBanner(customize = '') {
  return `
                                                                                              ..
              .OO.  ..........         x00000OOkdc,     ,0000000000o .k0O,        o00l   'lxO0000Oxl,
              .... .....               x00;....,ck0Oc    ..........   .x00:      d00c  ;k0Ol,....,lO0O:
    O0000000000000000000o  .......     x00'       o00o   .........      o00c   .x0O,  :00d.         o00c
        ..  ............               x00'       '000. ,000OOOOOO;      l00o .k0O'   x00,          '00x
       .kO' ......................     x00'      .d00l  ,00x              :00xO0k.    ;00x.        .d00c
                  .'''''.              x00c'',,:dO0x,   ,00k'''''''.       'O00d.      'd00dc,'',:dO0x,
                  ldddddc  ...         ldddddddoc,.     .dddddddddd:        .xc          .,cdxkkxdl;.

        ${customize}
  `;
}

console.log(
  colors.green(
    devoBanner('dab-cli: Devo Applications Builder command line utilities')
  )
);

/**
 * Description
 */
program
  .version(ver)
  .description('Devo Applications Builder Client command line');

/**
 * Command: Check
 */
program
  .command('check')
  .description('Check requirements to install and run the client command line')
  .action((...args) => {
    execute = true;
    checkAction(...args);
  });

/**
 * Command: Create
 */
program
  .command('create <name>')
  .option(
    '-t --template <template>',
    'Git repository url to clone or local zip file path of an existing application',
    /^(.*)$/i,
    'git@github.com:DevoInc/applications-builder-template.git'
  )
  .description(
    `Create an application from a zip file template or an existing git repository`
  )
  .action((...args) => {
    execute = true;
    createAction(...args);
  });

/**
 * Command: Build
 * Modes: dev, pre, pro & bundle
 */
program
  .command('build <mode>')
  .option('-r --release [release]', 'Release tag',)
  .option('--analyze', 'Use the analyzer tools')
  .option('--external-deps', 'Externalize web dependencies')
  .description('Build the application.')
  .action((...args) => {
    execute = true;
    buildAction(...args);
  });

/**
 * Command: Test
 */
program
  .command('test')
  .alias('t')
  .description('Execute test over the application.')
  .action(() => {
    execute = true;
    console.log('In construction...');
  });

/**
 * Command: Translations
 */
program
  .command('trans')
  .description('Check app translations.')
  .action((...args) => {
    execute = true;
    transAction(...args);
  });

program.parse(process.argv);

if (!process.argv.slice(2).length || !execute) {
  program.outputHelp();
}
