// imports express
const express = require('express');
// imports express router
const router = express.Router();
// imports database connection
const { pool } = require("../db");

/* GET users listing. */
router.get('/', function(req, res, next) {
  pool.query("SELECT * FROM users;", async(error, results) => {
    if(error) { throw error }
    console.log(results.rows)
    await res.status(200).json(results.rows)
  })
});

// exports route
module.exports = router;
