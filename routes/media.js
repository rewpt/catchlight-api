// imports express and router
const router = require('express').Router();

module.exports = db => {

  // GET /api/media
  // returns an array of media
  router.get('/', async (req, res) => {
    const query = 'SELECT * FROM media';

    try {
    const { rows } = await db.query(query);
    res.json(rows);
    } catch (e) {
      res.send(e)
    };
  })

  // GET /api/media/:id
  // returns a media
  router.get('/:id', async (req, res) => {
    const { id } = req.params;
    const queryParams = [id];
    const query = 'SELECT * FROM media WHERE id = $1';

    try {
    const { rows } = await db.query(query, queryParams);
    res.json(rows);
    } catch (e) {
      res.send(e)
    };
  });

  // POST /api/media
  // Creates a new media
  router.post('/', async (req, res) => {
    const title = req.body.title;
    const description = req.body.description;
    const image = req.body.image;
    const imdb_id = req.body.imdb_id;
    const queryParams = [title, description, image, imdb_id];
    const query = 'INSERT INTO media (title, description, image, imdb_id) VALUES ($1, $2, $3, $4)';

    try {
    await db.query(query, queryParams);
    res.json('created new media');
    } catch (e) {
      res.send(e)
    };
  })

  // PUT /api/media/:id
  // Modifies a media
  router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const title = req.body.title;
    const description = req.body.description;
    const image = req.body.image;
    const imdb_id = req.body.imdb_id;
    const queryParams = [title, description, image, imdb_id, id];
    const query = 'UPDATE media SET title = $1, description = $2, image = $3, imdb_id = $4 WHERE id = $5';

    try {
    await db.query(query, queryParams);
    res.json('updated media');
    } catch (e) {
      res.send(e)
    };
  });


  // DELETE /api/media/:id
  // Destroys a media
  router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    const queryParams = [id]
    const query = 'DELETE FROM media WHERE id = $1';
    
    try {
    await db.query(query, queryParams);
    res.json('destroyed media');
    } catch (e) {
      res.send(e)
    };
  });

  return router;
};