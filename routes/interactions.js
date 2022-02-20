const { json } = require('express/lib/response');
const { authenticateToken } = require('../middleware/authorization');

const router = require('express').Router();

module.exports = db => {

  
  // GET api/interactions/:id
  // returns a interaction
  router.get('/:id', async (req, res) => {
    const { id } = req.params;
    const queryParams = [id];
    const query = 'SELECT * FROM interactions WHERE id = $1';
    
    try {
      const { rows } = await db.query(query, queryParams);
      res.json(rows);
    } catch (e) {
      res.send(e);
    }
  });
  
  router.get('/count/:id', authenticateToken, async (req, res) => {
    const query = `
    SELECT COUNT(*) as total_count,
    COUNT(*) FILTER (WHERE rating = 'like') AS like_count,
    COUNT(*) FILTER (WHERE rating = 'dislike') AS dislike_count,
    COUNT(*) FILTER (WHERE rating = 'meh') AS meh_count
    FROM interactions
    WHERE media_id = $1
    AND rating != 'interest';
    `
    const params = [req.params.id]

    try {
      const { rows } = await db.query(query, params);

      res.json(rows)
    } catch(e) {
      res.send({"error": e.detail})
    }
  });

  // POST api/interactions
  // Creates a interaction


  router.post('/', authenticateToken, async (req, res) => {
    const user_id = req.user.id;
    const media_id = parseInt(req.body.id)
    const rating = req.body.rating;
    const queryParams = [rating, user_id, media_id]

    //Find if there are any instances of a user 
    const query1 = `UPDATE interactions SET rating=$1 WHERE user_id=$2 AND media_id=$3;`
    const query2 = `INSERT INTO interactions (rating, user_id, media_id)
           SELECT $1, $2, $3
           WHERE NOT EXISTS (SELECT 1 FROM interactions WHERE user_id=$2 AND media_id=$3);`
    try {
      await db.query(query1, queryParams);
    } catch (e) {
        
    }; 
    try {
      await db.query(query2, queryParams);
      res.json('Interaction Updated');
    } catch (e2) {
      res.send(e2); 
    };
  });

  // PUT api/interactions/:id
  // Modifies a interaction
  router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const user_id = req.body.user_id;
    const media_id = req.body.media_id;
    const rating = req.body.rating;
    const queryParams = [user_id, media_id, rating, id];
    const query = 'UPDATE interactions SET user_id = $1, media_id = $2, rating = $3 WHERE id = $4';

    try {
    await db.query(query, queryParams);
    res.json('updated interaction');
    } catch (e) {
      res.send(e)
    };
  });

  
  return router;
};
