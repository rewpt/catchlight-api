// imports express
const router = require('express').Router();


module.exports = db => {
  
  /* GET users listing. */
  router.get('/', async (req, res) => {
    const query = "SELECT * FROM users;"

    const users = await db.query(query)

    res.send(users)
  });
  return router;
}
