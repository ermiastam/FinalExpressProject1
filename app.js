var express = require('express');
var path = require('path');


const jwt = require('express-jwt');
const jwks = require('jwks-rsa');
const cors = require('cors');


var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var monk = require('monk');
//var db = monk('mongodb://swiftTeam:swift@ds035310.mlab.com:35310/swifthire');
var db = require('mongoskin').db('mongodb://swiftTeam:swift@ds035310.mlab.com:35310/swifthire');

var index = require('./routes/index');
var users = require('./routes/users');
var posts = require('./routes/posts');
var myposts = require('./routes/jobposts');

var app = express();
app.use(cors());
const authCheck = jwt({
    secret: jwks.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: "https://swifthireapp.auth0.com/.well-known/jwks.json"
    }),
    audience: '6XaSK7EIxsRYjOTTQp1GOLtxzmxCfduo',
    issuer: "https://swifthireapp.auth0.com/",
    algorithms: ['RS256']
});



app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.set('strict routing',true);

// Make our db accessible to our router
app.use(function(req,res,next){
    req.db = db;
    next();
});


app.use('/',authCheck,index);
app.use('/users',authCheck, users);
app.use('/api',authCheck, posts);
app.use('/myposts',authCheck, myposts);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;
app.listen(5001);
