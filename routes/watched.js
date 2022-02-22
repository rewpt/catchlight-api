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
    SELECT media_id, rating
    FROM interactions
    WHERE user_id = $1
    AND rating != 'interest';
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