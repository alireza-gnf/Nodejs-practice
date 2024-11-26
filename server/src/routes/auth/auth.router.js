const path = require("path");
const express = require("express");
const passport = require("../auth/auth.controller");

const Router = express.Router();

Router.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "..", "..", "login.html"));
});
Router.get("/google", passport.authenticate("google"));
Router.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: "/",
    failureRedirect: "/auth/login",
  })
);
Router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/auth/login");
  });
});

module.exports = Router;
