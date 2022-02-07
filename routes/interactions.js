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

  // POST api/interactions
  // Creates a interaction
  router.post('/', async (req, res) => {
    const user_id = req.body.user_id;
    const media_id = req.body.media_id;
    const watched = req.body.watched;
    const rating = req.body.rating;
    queryParams = [user_id, media_id, watched, rating];
    const query = 'INSERT INTO interactions (user_id, media_id, watched, rating) VALUES ($1, $2, $3, $4)';

    try {
      await db.query(query, queryParams);
      res.json('created new interaction');
    } catch (e) {
      res.send(e);
    };
  })

  // PUT api/interactions/:id
  // Modifies a interaction
  router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const user_id = req.body.user_id;
    const media_id = req.body.media_id;
    const watched = req.body.watched;
    const rating = req.body.rating;
    const queryParams = [user_id, media_id, watched, rating, id];
    const query = 'UPDATE interactions SET user_id = $1, media_id = $2, watched = $3, rating = $4 WHERE id = $5';

    try {
    await db.query(query, queryParams);
    res.json('updated interaction');
    } catch (e) {
      res.send(e)
    };
  });

  
  return router;
};
