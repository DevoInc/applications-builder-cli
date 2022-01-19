const paths = require('../../paths');
const config = require('../config');

const ExtractTextPlugin = require('extract-text-webpack-plugin');
const extractSass = new ExtractTextPlugin('[name].css');
const extractHtml = new ExtractTextPlugin('[name].html');

module.exports = function () {
  let rules = [];
  let extractPlugins = [];

  // Javascript loader ES6 to plain (Firefox 47)
  rules.push({
    test: /\.jsx?$/,
    // Exclude D3 because is not working with transpilation
    // https://stackoverflow.com/questions/35560305/d3-js-uncaught-typeerror-cannot-read-property-document-of-undefined
    exclude: [/node_modules\/d3/],
    use: {
      loader: paths.getModule('babel-loader'),
      options: {
        presets: [
          [
            paths.getModule('@babel/preset-env'),
            {
              targets: {
                browsers: ['firefox >= 44'],
              },
              forceAllTransforms: config.isMinified(),
              loose: true,
            },
          ],
          [paths.getModule('@babel/preset-react')],
        ],
        plugins: [
          '@babel/plugin-proposal-object-rest-spread',
          '@babel/plugin-transform-modules-commonjs',
          '@babel/plugin-proposal-class-properties',
          '@babel/plugin-transform-runtime',
          '@babel/plugin-proposal-optional-chaining',
        ],
      },
    },
  });

  // SASS Loader
  rules.push({
    test: /\.s[ac]ss$/,
    use: extractSass.extract({
      use: [
        {
          loader: 'css-loader',
          options: {
            url: true,
          },
        },
        {
          loader: 'sass-loader',
          options: {
            url: true,
          },
        },
      ],
      // use style-loader in development
      fallback: 'style-loader',
    }),
  });
  extractPlugins.push(extractSass);

  // HTML Loader
  rules.push({
    test: /\.(html|htm)$/,
    use: extractHtml.extract({
      use: [
        {
          loader: 'html-loader',
          options: {
            minimize: config.isMinified(),
          },
        },
      ],
    }),
  });
  extractPlugins.push(extractHtml);

  // URL Loader
  rules.push({
    test: /\.(png|woff|woff2|eot|ttf|svg|gif)$/,
    loader: 'url-loader',
  });

  // Register global stuff on apps framework initialization
  rules.push({
    test: /app\.js$/,
    use: {
      loader: 'webpack-append',
      query: `
        // Register a global namespace for the framework
        window.vapp_framework = {}

        // Registered setInterval calls will be saved here
        window.vapp_framework.registered_intervals = [];

        // The vapp can use this to know if it has been compiled for a dev/pre or pro environment
        window.vapp_framework.getCompilationMode = function() {
          return '${config.getMode()}'
        }`,
    },
  });

  return { rules, extractPlugins };
};
