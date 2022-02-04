const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.json({"we got this":"yep"})
});

module.exports = router;
