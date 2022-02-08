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

  router.put('/:id', async (req, res) => {
    const date = new Date()
    const userId = req.params.id
    const extraQueryParams = [date, userId]

    // takes req.body and outputs the values in an array to be used in the SET portion of the bellow query
    const setValuesWithoutExtras = createSetString(req.body)

    // takes the array created on line 65 and adds any additional options that need updating in the table
    const setValuesWithExtras = addAdditionalSetOptions("modified", setValuesWithoutExtras)
    const paramsArray = Object.values(req.body).concat(addonQueryParams)

    const query = `
      UPDATE users
      SET ${setValuesWithExtras.toString()}
      WHERE id = $${paramsArray.length};
    `
 
    try {
      await db.query(query, paramsArray);
      res.send("success: user updated");

    } catch(error) {
      res.send({"error": error.detail});
    }
  })

  return router;
}
