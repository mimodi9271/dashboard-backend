const mongoose = require("mongoose");
const express = require("express");
const { User } = require("../models/usermodel");
const router = express.Router();
const _ = require("lodash");
const bcrypt = require("bcrypt");
const Joi = require("joi");
var jwt = require("jsonwebtoken");
const config = require("config");

router.post("/", async (req, res) => {
  // console.log(req.body)

  const { error } = authValidate(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }

  let user = await User.findOne({ email: req.body.email });
  if (!user) {
    res.status(400).send("invalid email or password");
    return;
  }

  let validpassword = await bcrypt.compare(req.body.password, user.password);
  if (!validpassword) {
    res.status(400).send("invalid password");
    return;
  }

  // const token = jwt.sign({_id : user._id} , config.get("jwtPrivateKey"))

//   const token = jwt.sign({ _id: user._id }, "jwtPrivateKey");

//   user.token = token;
  // res.send(_.pick(user , ["_id" , "name" , "email" , "token"]));

  const token = user.generateAuthToken();

  res
    .header("Access-Control-Expose-Headers" , "x-auth-token")
    .header("x-auth-token", token)
    .send(_.pick(user, ["_id", "name", "email"]));
});

function authValidate(auth) {
  const schema = Joi.object({
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required(),
  });

  return schema.validate(auth);
}

module.exports = router;
