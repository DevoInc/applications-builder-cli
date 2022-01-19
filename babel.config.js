module.exports = function (api) {
  api.cache(true);
  const presets = ['@babel/env', '@babel/preset-react'];
  const plugins = [
    '@babel/plugin-proposal-object-rest-spread',
    '@babel/plugin-transform-modules-commonjs',
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-transform-runtime',
    '@babel/plugin-proposal-optional-chaining'
  ];
  return {
    presets,
    plugins,
  }
}
