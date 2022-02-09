// imports express
const router = require('express').Router();
const { createSetString, addAdditionalSetOptions } = require('./helper/dynamicSQL');
const bcrypt = require('bcrypt');


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

  // GET one user
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

  // POST new user
  router.post('/register', async (req, res) => {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const userParams = [req.body.email, req.body.name, hashedPassword]

    const query = `
      INSERT INTO users (email, name, password) 
      VALUES ($1::VARCHAR(255), $2::VARCHAR(255), $3::VARCHAR(255))
      RETURNING *;
    `

    try {
      const newUser = await db.query(query, userParams);
      console.log(newUser);
      res.json({users:newUser.rows[0]});

    } catch(error) {
      res.send({"error": error.detail})
    }

  });

  // PUT existing user
  router.put('/:id', async (req, res) => {
    const date = new Date()
    const userId = req.params.id

    // two variables that create the params required for the UPDATE syntax
    const extraQueryParams = [date, userId]
    const paramsArray = Object.values(req.body).concat(extraQueryParams)


    // takes req.body and outputs the values that need updating in an array to be used in the SET portion of the below query
    const setValuesWithoutExtras = createSetString(req.body)

    // takes the array created on line 72 and adds any additional options that need updating, that were not specified in req.body
    const setValuesWithExtras = addAdditionalSetOptions("modified", setValuesWithoutExtras)

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
