const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { jwtTokens } = require('./helper/jwt');


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
      const validPassword = await bcrypt.compare(password, users.rows[0].password);
      if(!validPassword) return res.status(401).json({error: "Incorrect password"});
      // JWT
      let tokens = jwtTokens(users.rows[0]);
      res.cookie('refresh_token', tokens.refreshToken, {httpOnly:true});
      res.json(tokens);
    } catch (e) {
      res.send(e);
    }
  })

  //logout
  router.delete('/refresh_token', (req, res) => {
    try {
      res.clearCookie('refresh_token');
      return res.status(200).json({message: 'refresh token deleted'})
    } catch (e) {
      res.status(401).json({error: error.message});
    }
  });

  // refresh_auth
  // allows users to refresh jwt token
  router.get('/refresh_token', (req, res) => {
    try {
      const refreshToken = req.cookies.refresh_token;
      if(refreshToken === null) return res.status(401).json({error:'Null refresh token'});
      jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (error, user) => {
        if(error) return res.status(403).json({error:error.message});
        let tokens = jwtTokens(user);

        // cookie setting may need modifications for front end server
        // { httpOnly: true, sameSite: 'none', secure: true }
        res.cookie('refresh_token', tokens.refreshToken, { httpOnly: true });
        res.json(tokens);
      });
    } catch (e) {
      res.status(401).json({error:error.message});
    }
  });
  
  return router;
};
