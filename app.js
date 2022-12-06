// Call all required libraries

var express = require('express');
var createError = require('http-errors');
var path = require('path');
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session');

var logger = require('morgan');



// Create Application Express

/*
    Security and Performance
*/
var helmet = require("helmet");
var cors = require("cors");
var compression = require('compression');
var passpt = require('./config/passport');

/*
    ROUTES
*/
var indexRouter = require('./routes/index');
var apiRouter = require("./routes/api");
var userRouter = require("./routes/users");



require('dotenv')
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));

app.set('view engine', 'pug');


/*
  MAINTENANCE MODE
*/
// if(process.env.MAINTENANCE_MODE == "TRUE"){app.use(require('./controllers/middlewares/middleMaintenance'));}

app.use(cors({credentials: true}))
app.use(helmet());
app.use(compression({level:2})) // Organizar isso.
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'node_modules')));



app.use(cookieSession({
  secret: process.env.APP_TOKEN_SESSION,
  resave: false,
  saveUninitialized: false,
  maxAge: 1 * (60 * 1000) // 1 min.
})) 

app.use(passpt.initialize());
app.use(passpt.session());


app.use('/', indexRouter);
app.use('/user', userRouter);
app.use('/api', apiRouter);
// app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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
