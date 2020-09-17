require('dotenv').config();

const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser');
const express      = require('express');
const favicon      = require('serve-favicon');
const mongoose     = require('mongoose');
const logger       = require('morgan');
const path         = require('path');
const session      = require('express-session');
const MongoStore   = require('connect-mongo')(session);
const bcrypt       = require('bcrypt');
const hbs          = require('hbs');

mongoose
  .connect(process.env.DBACCESS || 'mongodb://localhost/joblogger', {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: true
  })
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`);
  })
  .catch(err => {
    console.error('Error connecting to mongo', err);
  });

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

// Register partials folder
hbs.registerPartials(path.join(__dirname, 'views/partials'));

const app = express();

// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());

// Express View engine setup

app.use(require('node-sass-middleware')({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  sourceMap: true
}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

// Helpers
var Filter = require("handlebars.filter");
Filter.registerHelper(hbs);
// session config
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000
    },
    saveUninitialized: false,
    resave: true,
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
      ttl: 24 * 60 * 60 * 1000
    })
  })
);

// default value for title local
app.locals.title = 'Job Logger';

const index = require('./routes/index');
app.use('/', index);

const router = require('./routes/auth');
app.use('/', router);

const position = require('./routes/position');
app.use('/position', position);

const user = require('./routes/user');
app.use('/user', user);

const dashboard = require('./routes/dashboard');
app.use('/dashboard', dashboard);

module.exports = app;