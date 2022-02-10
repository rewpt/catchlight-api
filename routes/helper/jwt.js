const jwt = require('jsonwebtoken');

//Generate an access token and a refresh token for this database user
function jwtTokens({ id, name, email }) {
  const user = { id, name, email}; 
  const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '10s' });
  const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '15s' });
  return ({ accessToken, refreshToken });
}

module.exports = { 
  jwtTokens
}