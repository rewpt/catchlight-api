const router = require('express').Router();

module.exports = db => {

  /* GET home page. */
  router.get('/', function(req, res, next) {
    res.send('messages')
  });
  
  return router;
};
