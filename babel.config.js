module.exports = {
  plugins: [['@babel/plugin-transform-typescript', { allowNamespaces: true }]],
  presets: [['@babel/preset-env', { targets: { node: 'current' } }], '@babel/preset-typescript'],
};
