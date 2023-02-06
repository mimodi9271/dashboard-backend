var jwt = require("jsonwebtoken");

function autho(req, res, next) {
  const token = req.header("x-auth-token");

  if (!token) {
    res.status(401).send("access denied ! not token !!! ");
    return;
  }

  try {
    const decode = jwt.verify(token, "jwtPrivateKey");
    req.user = decode;
    next()
  } catch (err) {
    res.status(400).send("invalid token !!!!");
  }
}

module.exports = autho;
