module.exports.isLoggedIn = (req, res) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "You must be logged in for further process!");
    return res.redirect("/signin");
  }
};
