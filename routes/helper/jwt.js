const jwt = require('jsonwebtoken');

//Generate an access token and a refresh token for this database user
function jwtTokens({ id, name, email }) {
  const user = { id, name, email}; 
  const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '120m' });
  const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '120m' });
  return ({ accessToken, refreshToken });
}

module.exports = { 
  jwtTokens
}