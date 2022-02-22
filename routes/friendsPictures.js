// imports express and router
const router = require('express').Router();
const { authenticateToken } = require('../middleware/authorization');


module.exports = db => {

  // GET /api/media
  // returns an array of media
  router.get('/', authenticateToken, async (req, res) => {

    const userID = req.user.id;

    const queryParams = [userID];

    const query = `
    SELECT
      id AS friend_id, 
      profile_picture
    FROM
      users
    WHERE
      users.id in (SELECT 
      recieving_user_id as friend_user_id
    FROM 
      friends
    WHERE 
      sending_user_id = $1
    AND 
      friendship = true
      
    UNION
      
    SELECT 
      sending_user_id as friend_user_id
    FROM 
      friends
    WHERE 
      recieving_user_id = $1
    AND 
      friendship = true);
    `;

    try {
    const { rows } = await db.query(query, queryParams);
    res.json(rows);
    } catch (err) {
      res.send(err)
    };
  });

  return router;
};