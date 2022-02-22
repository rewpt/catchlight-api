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
    recieving_user_id AS id,
    (SELECT json_agg(interactions)::jsonb
      FROM (
        SELECT id, media_id, rating FROM interactions WHERE user_id = friends.recieving_user_id
      ) AS interactions
    ) AS interactions
  FROM 
    friends 
  WHERE 
    sending_user_id = $1  
  AND 
    friendship = true
  
  UNION
  
  SELECT 
    sending_user_id AS id,
      (SELECT json_agg(interactions)::jsonb
      FROM (
        SELECT id, media_id, rating FROM interactions WHERE user_id = friends.sending_user_id
      ) AS interactions
    ) AS interactions
  FROM 
    friends 
  WHERE 
    recieving_user_id = $1 
  AND 
    friendship = true;
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