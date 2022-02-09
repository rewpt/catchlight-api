const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = db => {

  // login
  router.post('/login', async (req, res) => {
    const {email, password} = req.body;
    const queryParams = [email];
    const query = `SELECT * FROM users WHERE email = $1`;

    try {
      // USER CHECK
      const users = await db.query(query, queryParams);
      if (users.rows.length === 0) return res.status(401).json({error: "Email is incorrect"})
      // PASSWORD CHECK
      const validPassword = await bcrypt.compare(password,users.row[0].user_password);
      if(!validPassword) return res.status(401).json({error: "Incorrect password"});
      return res.status(200).json("success");
    } catch (e) {
      res.send(e);
    }
  })

  //logout
  
  return router;
};
