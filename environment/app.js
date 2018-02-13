const staticAssets = require('./static-assets.json'),
  Handlebars  = require('express-handlebars'),
  appMounts = require('./app-mounts.json'),
  compression = require('compression'),
  Index = require('serve-index'),
  winston = require('winston'),
  express = require('express'),
  morgan = require('morgan'),
  {env} = require('config'),
  path = require('path'),
  fs = require('fs');

const app = express();
app.locals.env = env;

app.use(compression());

app.engine('stache', Handlebars({
  extname: '.stache',
  defaultLayout: false,
  helpers: {
    is: function( a, b, options ) {
      return a === b ? options.fn() : options.inverse();
    },
    joinBase: function() {
      let args = Array.prototype.slice.call(arguments, 0, -1);
      args.unshift('/assets');
      return path.join.apply(path, args);
    }
  }
}));

app.set('view engine', 'stache');
app.set('views', path.join(__dirname, '../assets'));

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

Object.keys(appMounts).forEach((mountPath) => {
  app.use(mountPath, function( req, res ) {
    res.render(appMounts[mountPath]);
  });
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
