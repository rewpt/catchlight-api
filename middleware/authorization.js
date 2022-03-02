const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']; // Bearer TOKEN
  const token = authHeader && authHeader.split(' ')[1]; // checks authHeader is not null, if so Bearer = [0], Token = [1]
  if(token == null) return res.status(401).json({error: "Null token"});
  jwt.verify(token, 'sdafsf32r3q2f3aff3wafaf3wfdawfw3af3wafaw3f3wafwfwa3f',(error, user) => {
    if(error) return res.status(403).json({error:error.message});
    req.user = user;
    next();
  });
}

module.exports = {
  authenticateToken
};