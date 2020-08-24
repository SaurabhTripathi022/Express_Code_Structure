const config = require('config');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const auth = async function (req, res, next) {
  console.log("Authorizing the user");

  const token = req.header('Authorization').replace('Bearer ', '');
  console.log(token);
  let secretkey = config.get('secretKey');

  try {
    let decode = await jwt.verify(token, secretkey);
    console.log(decode);

    console.log("Finding User..")
    let user = await User.findOne({
      _id: decode._id,
      'tokens.token': token
    });

    console.log("Got User with id ", decode._id)
    if (user) {
      req.user = user;
      req.token = token;
      req.isAdmin = decode.isAdmin
      next();
    } else {
      return res.status(401).send("Unauthorized, missing token");
    }
  } catch (e) {
    console.log(e);
    res.status(401).send("Unauthorized, missing token");
  }

}

module.exports = auth;