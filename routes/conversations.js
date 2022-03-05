const router = require('express').Router();
const { authenticateToken } = require('../middleware/authorization');

module.exports = db => {

  // Gets a particular conversation 
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

  //Creates a new conversation
  router.post('/', authenticateToken, async function(req, res) {
    const { mediaID, friendUserId, mediaTitle } = req.body;
    const userId = req.user.id;
    const checkConvoQuery = `SELECT conversations.id FROM conversations JOIN conversation_participants on conversation_participants.conversation_id = conversations.id WHERE 
    conversation_participants.user_id = $1 AND conversation_participants.conversation_id IN
    (SELECT conversations.id FROM conversations 
    JOIN conversation_participants on conversations.id = conversation_participants.conversation_id 
    WHERE conversations.media_id= $2 AND user_id = $3); `
    const checkConvoParams = [userId, mediaID, friendUserId];
    const greeting = `Hey! Let's talk about ${mediaTitle}`  

    const convParams = [ mediaID ];
    const convQuery = "INSERT INTO conversations (media_id) VALUES ($1) returning *;";
    const convPartQuery = "INSERT INTO conversation_participants (user_id, conversation_id) VALUES($1, $2) returning *;"
    try {

    
    const conversationCheck = await db.query(checkConvoQuery, checkConvoParams);
    res.json(conversationCheck);
   
    try {
    const conversation = await db.query(convQuery, convParams);
    const convId = conversation.rows[0].id;

    const convPartParams1 = [ userId, convId ];
    const conversationParticipants1 = await db.query(convPartQuery, convPartParams1);

    const convPartParams2 = [ friendUserId, convId ];
    const conversationParticipants2 = await db.query(convPartQuery, convPartParams2);

    const messageParams = [ userId, convId, greeting ];
    const messageQuery = `
    INSERT INTO messages (user_id, conversation_id, content)
    VALUES ($1, $2, $3);
    `

    const messageToFriend = await db.query(messageQuery, messageParams);
    res.json('message sent!');
  } catch (err) {
    res.send(err);
   }
   catch (err) {
    console.log(err);
  }

  });

  // Modifies a particular conversation
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

  //Creates a new message
  router.post('/:id/messages', async function(req, res) {
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

  // Gets a particular message from a particular conversation
  router.get('/:conversation_id/messages/:msg_id', async function(req, res) {
    const queryParams = [req.params.msg_id, req.params.conversation_id];
    const query = "SELECT * FROM messages WHERE messages.id = $1 and messages.conversation_id = $2;";
    try{
    const message = await db.query(query, queryParams);
    res.json(message.rows);
    } catch (err) {
      res.send(err.detail);
    }
  });

  //Modifies a message from a particular conversation
  router.put('/:conversation_id/messages/:msg_id', async function(req, res) {
    const { user_id, conversation_id, content } = req.body
    const queryParams = [user_id, conversation_id, content, req.params.msg_id, req.params.conversation_id];
    const query = "UPDATE messages SET user_id= $1, conversation_id = $2, content = $3 WHERE id = $4 and messages.conversation_id = $5 returning *";
    try {
    const message = await db.query(query, queryParams);
    res.json(message.rows);
   } catch (err) {
    res.send(err);
   }
  });

  // Gets a conversation's participants
  router.get('/:id/participants/', async function(req, res) {
    const queryParams = [req.params.id];
    const query = "SELECT * FROM conversation_participants WHERE conversation_participants.conversation_id = $1";
    try {
    const conversation_participants = await db.query(query, queryParams);
    res.json(conversation_participants.rows);
   } catch (err) {
    res.send(err);
   }
  });

// Gets friends of logged in user who they have conversations with

  router.get('/participants/friends', authenticateToken, async function(req, res, next) {
    try {
      
      const query = "SELECT DISTINCT users.id, users.name, users.profile_picture FROM conversation_participants JOIN users on users.id = conversation_participants.user_id WHERE conversation_id IN (select conversation_id from conversation_participants WHERE user_id = $1) AND users.id !=$1";
      queryParams = [req.user.id];
      const friendsWithConversations = await db.query(query, queryParams)
      res.send(friendsWithConversations.rows)
    } catch(error) {
      res.send({"error": error.detail})
    }
    
  });

  // Gets Topics For a particular friend of a user

  router.post('/topics', authenticateToken, async function(req, res, next) {
    try {

      const query = "SELECT media.title, media.id FROM media WHERE media.id IN (Select media_id FROM conversations WHERE conversations.id IN (Select conversation_id FROM conversation_participants where user_id = $2 AND conversation_id IN (SELECT conversation_id from conversation_participants WHERE user_id = $1))) "
      queryParams = [req.user.id, req.body.activeFriend];

      const friendsWithConversations = await db.query(query, queryParams)
      res.send(friendsWithConversations.rows)
    } catch(error) {
      res.send({"error": error.detail})
    }
    
  });

  router.post('/messages', authenticateToken, async function(req, res, next) {
    try {

      const query = "SELECT * from messages WHERE messages.conversation_id = (SELECT id FROM conversations WHERE media_id = $1 AND conversations.id IN (Select conversation_id FROM conversation_participants where user_id = $2 AND conversation_id IN (SELECT conversation_id from conversation_participants WHERE user_id = $3)));"  
      queryParams = [req.body.topicSelected, req.user.id, req.body.activeFriend, ];

      const conversationMessages = await db.query(query, queryParams)
      res.send(conversationMessages.rows)
    } catch(error) {
      res.send({"error": error.detail})
    }
    
  });

  router.post('/messagesend', authenticateToken, async function(req, res, next) {
    try {

      const userID = req.user.id;
      const conversationID = req.body.conversationID;
      const content = req.body.content; 

      queryParams = [userID, conversationID, content];
      const query = `INSERT INTO messages (user_id, conversation_id, content, deleted) VALUES  ($1, $2, $3, false)`;

      const messageSent = await db.query(query, queryParams)
      res.send(messageSent)
    } catch(error) {
      res.send({"error": error.detail})
    }
    
  });


  //Modifies a conversation's participant, sets message waiting to false
  router.put('/:conversation_id/participants/:id', async function(req, res) {
    const queryParams = req.params.id;
    const query = "UPDATE conversation_participants SET message_waiting = false WHERE id = $1 returning *";
    try{
    const conversation = await db.query(query, queryParams);
    res.json(conversation)
    } catch (err) {
      res.send(err);
    }
  })
  
  return router;
};

