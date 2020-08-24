async function admin(req, res, next) {

  console.log("Validating for Admin Role");
  if (req.isAdmin) {
    next();
  } else {
    res.status(403).send("Forbidden...");
  }
}

module.exports = admin;