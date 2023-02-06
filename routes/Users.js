const mongoose = require("mongoose");
const express = require("express");
const { User, userValidate } = require("../models/usermodel");
const router = express.Router();
const _ = require("lodash");
const bcrypt = require("bcrypt");
const Joi = require("joi");
var jwt = require("jsonwebtoken");
const config = require("config");
const autho = require("../middleware/autho-rization");

router.get("/me", autho, async (req, res) => {
  const user = await User.findById(req.user._id);
  console.log(req)
  res.send(user);
});

router.post("/", async (req, res) => {
  console.log(req.body);
  const { error } = userValidate(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }

  let user = await User.findOne({ email: req.body.email });
  if (user) {
    res.status(400).send("email already registered");
    return;
  }

  user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  user = await user.save();

  //   const token = jwt.sign({ _id: user._id }, "jwtPrivateKey");

  const token = user.generateAuthToken();

  //   user.token = token;
  // res.send(_.pick(user , ["_id" , "name" , "email" , "token"]))

  res
    .header("Access-Control-Expose-Headers", "x-auth-token")
    .header("x-auth-token", token)
    .send(_.pick(user, ["_id", "name", "email"]));
});

module.exports = router;
