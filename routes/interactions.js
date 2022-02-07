const router = require('express').Router();

module.exports = db => {

  /* GET home page. */
  router.get('/:id', async (req, res) => {
    const { id } = req.params;
    const params = [id];
    const { rows } = await db.query('SELECT * FROM interactions WHERE id = $1', params);
    res.send(rows);
  });
  
  return router;
};
