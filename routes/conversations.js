const router = require('express').Router();

module.exports = db => {

  /* GET home page. */
  router.get('/:id', async function(req, res) {
    const queryParams = [req.params.id];
    const query = "SELECT * FROM conversations WHERE conversations.id = $1;";
    try{
    const conversations = await db.query(query, queryParams);
    res.json(conversations.rows);
    } catch (err) {
      res.send(err.detail);
    }
  });

  router.post('/', async function(req, res) {
    const queryParams = [req.body.media_id];
    const query = "INSERT INTO conversations (media_id) VALUES ($1) returning *";
    try {
    const conversation = await db.query(query, queryParams);
    res.json(conversation.rows);
   } catch (err) {
    res.send(err);
   }
  });

  router.put('/:id', async function(req, res) {
    const queryParams = [req.body.media_id, req.params.id];
    const query = "UPDATE conversations SET media_id= $1 WHERE id = $2 returning *";
    try {
    const conversation = await db.query(query, queryParams);
    res.json(conversation.rows);
   } catch (err) {
    res.send(err);
   }
  });

  router.post('/', async function(req, res) {
    const queryParams = [req.body.media_id];
    const query = "INSERT INTO conversations (media_id) VALUES ($1) returning *";
    try {
    const conversation = await db.query(query, queryParams);
    res.json(conversation.rows);
   } catch (err) {
    res.send(err);
   }
  });

  router.post('/messages', async function(req, res) {
    const { user_id, conversation_id, content } = req.body
    const queryParams = [user_id, conversation_id, content];
    const query = "INSERT INTO messages (user_id, conversation_id, content) VALUES ($1, $2, $3) returning *";
    try {
    const message = await db.query(query, queryParams);
    res.json(message.rows);
   } catch (err) {
    res.send(err);
   }
  });

  router.get('/messages/:id', async function(req, res) {
    const queryParams = [req.params.id];
    const query = "SELECT * FROM messages WHERE messages.id = $1;";
    try{
    const message = await db.query(query, queryParams);
    res.json(message.rows);
    } catch (err) {
      res.send(err.detail);
    }
  });

  router.put('/messages/:id', async function(req, res) {
    const { user_id, conversation_id, content } = req.body
    const queryParams = [user_id, conversation_id, content, req.params.id];
    const query = "UPDATE messages SET user_id= $1, conversation_id = $2, content = $3 WHERE id = $4 returning *";
    try {
    const message = await db.query(query, queryParams);
    res.json(message.rows);
   } catch (err) {
    res.send(err);
   }
  });

  router.get('/participants/:conversation_id', async function(req, res) {
    const queryParams = [req.params.conversation_id];
    const query = "SELECT * FROM conversation_participants WHERE conversation_participants.conversation_id = $1";
    try {
    const conversation_participants = await db.query(query, queryParams);
    res.json(conversation_participants.rows);
   } catch (err) {
    res.send(err);
   }
  });

  router.put('/participants/not_waiting/:id', async function(req, res) {
    const queryParams = req.params.id;
    const query = "UPDATE conversation_participants SET message_waiting = false WHERE id = $1";
    try{
    const conversation = await db.query(query, queryParams);
    res.json(conversation)
    } catch (err) {
      res.send(err);
    }
  })
  
  return router;
};
