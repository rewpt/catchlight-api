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


  
      const queryGET = `
      SELECT 
        *
      FROM 
        interactions
      WHERE
        user_id = $1
      AND
        media_id = $2;
      `;

      const queryPUT = `
      UPDATE 
        interactions
      SET
        rating = 'interest'
      WHERE
        user_id = $1
      AND
        media_id = $2;
      `;

      const queryPOST = `
      INSERT INTO interactions (
        user_id, media_id, rating
      )
      VALUES (
        $1, $2, 'interest'  
      );
      `;


    const { rows } = await db.query(queryGET, queryParams);
    // res.json(rows);
    // console.log('true', rows);

    if (rows.length) {
      // PUT
      console.log('true // PUT', rows)
      await db.query(queryPUT, queryParams);
    } else {
      // POST
      console.log('false // POST', rows)
      await db.query(queryPOST, queryParams);
    }

    res.send('ok');
    } catch (err) {
      res.send(err)
    };
  });

  return router;
};