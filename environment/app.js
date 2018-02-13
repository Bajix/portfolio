const staticAssets = require('./static-assets.json'),
  compression = require('compression'),
  Index = require('serve-index'),
  winston = require('winston'),
  express = require('express'),
  morgan = require('morgan'),
  {env} = require('config'),
  path = require('path'),
  fs = require('fs');

const app = express();

app.use(compression());

staticAssets.forEach((mountPath) => {
  let assetPath = path.join(__dirname, '../', mountPath),
    stats = fs.lstatSync(assetPath);

  app.use(mountPath, express.static(assetPath));

  if (stats.isDirectory()) {
    app.use(assetPath, Index(assetPath, {
      hidden: true,
      icons: true
    }));
  }
});

app.use(morgan('tiny', {
  skip: function( req, res ) {
    if (env === 'test') {
      return true;
    }
    return false;
  },
  stream: {
    write: function( message ) {
      winston.info(message);
    }
  }
}));

module.exports = app;
