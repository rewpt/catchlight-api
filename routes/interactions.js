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
  router.post('/', async (req, res) => {
    const user_id = req.body.user_id;
    const media_id = req.body.media_id;
    const rating = req.body.rating;
    const queryParams = [user_id, media_id, rating]

    const query = `INSERT INTO interactions (user_id, media_id, rating) VALUES ($1, $2, $3)`;
    
    try {
      await db.query(query, queryParams);
      res.json('created new interaction');
    } catch (e) {
      res.send(e);
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
