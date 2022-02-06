// imports
const createError = require('http-errors');
const db = require("./db")
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

// router imports
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const mediaRouter = require('./routes/media');


// create express object
const app = express();

// middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// router
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/media', mediaRouter);


// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json(err);
});
// app.get('/items', db.getItems)

// catch 404 and forward to error handler
// keep this code at bottom
app.use(function(req, res, next) {
  next(createError(404));
});

module.exports = app;
