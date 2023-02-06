const mongoose = require("mongoose");
const express = require("express");
var jwt = require("jsonwebtoken");

const Joi = require("joi");
const { boolean } = require("joi");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 5, maxlength: 50 },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    unique: true,
  },
  password: { type: String, required: true, minlength: 5, maxlength: 1024 },
  isAdmin : Boolean
});

userSchema.methods.generateAuthToken = function(){
  const token = jwt.sign({ _id: this._id , isAdmin : this.isAdmin }, "jwtPrivateKey");
  return token;
}

const User = mongoose.model("User", userSchema);

function userValidate(user) {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required(),
  });

  return schema.validate(user);
}

module.exports.User = User;
module.exports.userValidate = userValidate;
