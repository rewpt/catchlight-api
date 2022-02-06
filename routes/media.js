// imports express and router
const router = require('express').Router();

module.exports = db => {

  /* GET users listing. */
  router.get('/', function(req, res, next) {
    db.query("SELECT * FROM media;", async(error, results) => {

    });
  });
  
  return router;
};