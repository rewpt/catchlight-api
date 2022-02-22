// imports express and router
const router = require('express').Router();
const { authenticateToken } = require('../middleware/authorization');


module.exports = db => {

  // GET /api/addToWatchList/:id
  // returns array if row exists
  router.get('/:id', authenticateToken, async (req, res) => {
    try {
      const userID = req.user.id;
      const mediaID = req.params.id
  
      const queryParams = [userID, mediaID];

      const query = `
      UPDATE 
        interactions
      SET
        rating = NULL
      WHERE
        user_id = $1
      AND
        media_id = $2;
      `;


    const { rows } = await db.query(query, queryParams);
    // res.json(rows);
    // console.log('true', rows);

    res.send('ok');
    } catch (err) {
      res.send(err)
    };
  });

  return router;
};