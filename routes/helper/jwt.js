const jwt = require('jsonwebtoken');

//Generate an access token and a refresh token for this database user
function jwtTokens({ id, name, email }) {
  const user = { id, name, email}; 
  const jwtToken = jwt.sign(user, 'sdafsf32r3q2f3aff3wafaf3wfdawfw3af3wafaw3f3wafwfwa3f', { expiresIn: '10000000s' });
  return ({jwtToken});
}

module.exports = { 
  jwtTokens
}