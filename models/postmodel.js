const mongoose = require("mongoose");
const express = require("express");

const Joi = require('joi')

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  userid : {type : mongoose.Schema.Types.ObjectId , ref : "User"}
});

const Post = mongoose.model("Post", postSchema);

function postValidate(post){

  const schema = Joi.object({
    title: Joi.string().min(3).required(),
    description : Joi.string().min(5),
    userid : Joi.string()
  });

  return schema.validate(post)
}

module.exports.Post = Post;
module.exports.postValidate = postValidate;
