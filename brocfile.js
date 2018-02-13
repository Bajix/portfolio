const compileSCSS = require('broccoli-eyeglass');

let scssNode = new compileSCSS([
  'assets'
], {
  cssDir: '/',
  verbose: true,
  fullException: true
});

module.exports = scssNode;
