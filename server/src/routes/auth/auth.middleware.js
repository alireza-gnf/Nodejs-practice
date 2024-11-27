async function authenticate(req, res, next) {
  if (!req.user && process.env.ENV !== "test") {
    return res.redirect("/auth/login");
  }
  next();
}

module.exports = authenticate;
