const user = require("./user");

module.exports = {
  getIndex: (req, res) => {
    if (req.user) {
      res.redirect('/user/'+req.user.id)
    } else {
      res.render("index.ejs", {user: req.user});
    }
  },
};
