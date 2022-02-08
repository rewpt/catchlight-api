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

  

  return router;
}
