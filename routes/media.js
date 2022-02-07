// imports express and router
const router = require('express').Router();

module.exports = db => {

  // GET /api/media
  // returns an array of media
  router.get('/', async (req, res) => {
    try {
    const query = 'SELECT * FROM media';
    const { rows } = await db.query(query);
    res.send(rows);
    } catch (e) {
      console.log(e);
    };
  })

  // GET /api/media/:id
  // returns single media object
  router.get('/:id', async (req, res) => {
    try {
    const { id } = req.params;
    const params = [id];
    const query = 'SELECT * FROM media WHERE id = $1';
    const { rows } = await db.query(query, params);
    res.send(rows);
    } catch (e) {
      console.log(e);
    };
  });

  // POST /api/media
  // Creates a new media
  router.post('/', async (req, res) => {
    try {
    const title = req.body.title;
    const description = req.body.description;
    const image = req.body.image;
    const imdb_id = req.body.imdb_id;
    const params = [title, description, image, imdb_id];
    const query = 'INSERT INTO media (title, description, image, imdb_id) VALUES ($1, $2, $3, $4)';
    await db.query(query, params);
    res.send('created new media');
    } catch (e) {
      console.log(e);
    };
  })

  // PUT /api/media/:id
  // Updates a media
  router.put('/:id', async (req, res) => {
    try {
    const { id } = req.params;
    const title = req.body.title;
    const description = req.body.description;
    const image = req.body.image;
    const imdb_id = req.body.imdb_id;
    const params = [title, description, image, imdb_id, id];
    const query = 'UPDATE media SET title = $1, description = $2, image = $3, imdb_id = $4 WHERE id = $5';
    await db.query(query, params);
    res.send('updated media');
    } catch (e) {
      console.log(e);
    };
  });


  // DELETE /api/media/:id
  // Destroys a media
  router.delete('/:id', async (req, res) => {
    try {
    const { id } = req.params;
    const params = [id]
    const query = 'DELETE FROM media WHERE id = $1';
    await db.query(query, params);
    res.send('destroyed media');
    } catch (e) {
      console.log(e);
    };
  });

  return router;
};