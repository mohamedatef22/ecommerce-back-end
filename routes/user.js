const express = require("express");
const router = express.Router();
const User = require("../models/user");
const _ = require("lodash");
const bcrypt = require("bcryptjs");

router.post("/register", async (req, res) => {
  try {
    const { error } = await User.validateUser(req.body);
    if (error) {
      const e = _.mapValues(_.mapKeys(error.details, "path"), "message");
      return res.status(400).send({
        error: e,
        type: "schema",
      });
    }
    let user = new User(req.body);
    if (user.password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(user.password, salt);
      user.password = hashedPassword;
    }
    user = await user.save();
    return res.send({ user: user });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).send({
        error: _.mapValues(error.errors, function (o) {
          return o.message;
        }),
        type: "database",
      });
    }

    res.status(500).send({ error: error });
  }
});

module.exports = router;
