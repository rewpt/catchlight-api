const jwt = require('jsonwebtoken');

//Generate an access token and a refresh token for this database user
function jwtTokens({ id, name, email }) {
  const user = { id, name, email}; 
  const jwtToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '10000000s' });
  return ({jwtToken});
}

module.exports = { 
  jwtTokens
}