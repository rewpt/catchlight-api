// imports
const createError = require('http-errors');
const db = require("./db/index")
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

// router imports
const conversationsRouter = require('./routes/conversations');
const friendsRouter = require('./routes/friends')
const indexRouter = require('./routes/index');
const interactionsRouter = require('./routes/interactions');
const mediaRouter = require('./routes/media');
const messagesRouter = require('./routes/messages');
const queriesRouter = require('./routes/queries');
const sessionsRouter = require('./routes/sessions');
const streamingServicesRouter = require('./routes/streamingServices');
const streamingSubscriptionsRouter = require('./routes/streamingSubscriptions');
const usersRouter = require('./routes/users');
const authRouter = require('./routes/auth');
const mediaFriendsRecommendationsRouter = require('./routes/mediaFriendsRecommendations');
const watched = require('./routes/watched');
const towatch = require('./routes/towatch');
const friendsPictures = require('./routes/friendsPictures');
const addToWatchList = require('./routes/addToWatchList');
const removeFromWatchList = require('./routes/removeFromWatchList');



// create express object
const app = express();

// middleware
app.use(cors({
  origin: '*',
  credentials: true
}));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// router
app.use('/', indexRouter(db));
app.use('/api/users', usersRouter(db));
app.use('/api/media', mediaRouter(db));
app.use('/api/interactions', interactionsRouter(db));
app.use('/api/conversations', conversationsRouter(db));
app.use('/api/streamingServices', streamingServicesRouter(db));
app.use('/api/queries', queriesRouter(db));
app.use('/api/friends', friendsRouter(db));
app.use('/api/streaming_subscriptions', streamingSubscriptionsRouter(db));
app.use('/api/messages', messagesRouter(db));
app.use('/api/sessions', sessionsRouter(db));
app.use('/api/auth', authRouter(db));
app.use('/api/mediaFriendsRecommendations', mediaFriendsRecommendationsRouter(db));
app.use('/api/watched', watched(db));
app.use('/api/towatch', towatch(db));
app.use('/api/friendsPictures', friendsPictures(db));
app.use('/api/addToWatchList', addToWatchList(db));
app.use('/api/removeFromWatchList', removeFromWatchList(db));


// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json(err);
});

// catch 404 and forward to error handler
// keep this code at bottom
app.use(function(req, res, next) {
  next(createError(404));
});

module.exports = app;
