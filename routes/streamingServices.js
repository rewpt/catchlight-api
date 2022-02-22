const router = require('express').Router();
const { authenticateToken } = require('../middleware/authorization');

module.exports = db => {

  /* GET streaming services of single media */
  router.get('/:id', authenticateToken, async (req, res) => {
    const mediaId = [req.params.id]
    const query = `
      SELECT title 
      FROM media_streaming_services JOIN streaming_services ON streaming_services.id = media_streaming_services.streaming_service_id
      WHERE media_id = $1;

    `
    try {
      const { rows } = await db.query(query, mediaId)
      res.json({rows})

    } catch(e) {
      console.log(e)

    }
  });
  
  return router;
};
