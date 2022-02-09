const router = require('express').Router();

module.exports = db => {

  // login
  router.get('/', function(req, res, next) {
    res.send('Server started successful...')
  });

  //logout
  
  return router;
};
