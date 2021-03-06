const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose')
const indexRouter = require('./routes/index');
const securedRouter = require('./routes/secured');
const excelRouter = require('./routes/excel');
const session = require('express-session')
const cors = require('cors')
const app = express();


mongoose.connect("mongodb://127.0.0.1:27017/data",
  {
    useNewUrlParser: true,
    useFindAndModify: true,
    useUnifiedTopology: true
  });

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(session({
  secret: 'string',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/excel', excelRouter);
app.use('/secured', function(req, res, next) {
  if (!req.session.loggedin)
    return res.status(401).send("Unauthorized")
  next();
}, securedRouter);

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
