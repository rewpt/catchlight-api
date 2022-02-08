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

  router.post('/', async (req, res) => {
    const userParams = [req.body.email, req.body.name, req.body.password]

    const query = `
      INSERT INTO users (email, name, password) 
      VALUES ($1::VARCHAR(255), $2::VARCHAR(255), $3::VARCHAR(255));
    `

    try {
      await db.query(query, userParams)
      res.send("success: user created in database")

    } catch(error) {
      res.send({"error": error.detail})
    }

  });

  

  return router;
}
