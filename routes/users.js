// imports express
const router = require('express').Router();
const { createSetString, addAdditionalSetOptions } = require('./helper/dynamicSQL')


module.exports = db => {
  
  /* GET users listing. */
  router.get('/', async (req, res) => {
    const query = `
      SELECT * FROM users;
      `

    try {
      const { rows } = await db.query(query)
      res.json(rows)

    } catch(error) {
      res.send({"error": error.detail})
    }
  });

  router.get('/:id', async (req, res) => {
    const userId = [req.params.id]

    try {
      const query = `
      SELECT * FROM users 
      WHERE id = $1::integer
      `

      const { rows } = await db.query(query, userId)
      // sends only applicable data
      res.json(rows[0])

    } catch(error) {
      res.send({"error": error.detail})
    }
  });

  

  return router;
}
