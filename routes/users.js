// imports express
const router = require('express').Router();
const { createSetString, addAdditionalSetOptions } = require('./helper/dynamicSQL');
const bcrypt = require('bcrypt');
const { authenticateToken } = require('../middleware/authorization');


module.exports = db => {
  
  // router.get('/', authenticateToken, async (req, res) => {
  /* GET users listing. */
  router.get('/', authenticateToken, async (req, res) => {
    
    const query = `
      SELECT * FROM users;
      `

    try {
      const { rows } = await db.query(query)
      res.json({users:rows})

    } catch(error) {
      res.send({"error": error.detail})
    }
  });

  // GET one user
  router.get('/user', authenticateToken, async (req, res) => {
    const userId = [req.user.id]
    
    try {
      const query = `
      SELECT name, email, profile_picture FROM users 
      WHERE id = $1::integer
      `
      
      const { rows } = await db.query(query, userId)
      res.json(rows[0])

    } catch(error) {
      res.send({"error": error.detail})
    }
  });

  // Get a user's ID
  router.get('/user/id', authenticateToken, async (req, res) => {
    try {
    const userId = [req.user.id]
    res.json(userId)
    }
    catch(error) {
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
      console.log('NEWUSER', newUser);
      if (newUser.rows.length === 0) return res.status(401).json({error: "Failed to create new user"})
      res.json({Users:newUser.rows[0]});

    } catch(error) {
      res.status(401).json({error: error.message});
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
