const mongoose = require("mongoose");
const express = require("express");
const { Post, postValidate } = require("../models/postmodel");
const router = express.Router();
const autho = require("../middleware/autho-rization");
const isAdmin = require("../middleware/isAdmin");
require("express-async-errors");

// const asyncfuncerror = require("../async-function-error/asyncfuncerror")

// router.get("/", autho , asyncfuncerror(async (req, res) => {
//   let userid = req.user._id;
//   const posts = await Post.find({userid : userid}).select("title description");
//   res.send(posts);
// }));

router.get("/", autho, async (req, res) => {
  let karbarid = req.user._id; 
  const posts = await Post.find({userid : karbarid}).select("title description");
  res.send(posts);
});

router.get("/:id", autho, async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    res.status(404).send("there is no post with this id");
  }
  res.send(post);
});

router.post("/", autho, async (req, res) => {
  let userid = req.user._id;
  const { error } = postValidate(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }

  const newpost = new Post({
    title: req.body.title,
    description: req.body.description,
    userid: userid,
  });

  const result = await newpost.save();
  res.send(result);
});

router.put("/:id", autho, async (req, res) => {
  let userid = req.user._id;

  const updateitem = await Post.findById(req.params.id);
  if (!updateitem) {
    res.status(404).send("there is no post with this given id");
    return;
  }

  const { error } = postValidate(req.body);
  if (error) {
    res.status(400).send(`${error.message}`);
    return;
  }

  updateitem.title = req.body.title;
  updateitem.description = req.body.description;
  updateitem.userid = userid;

  const result = await updateitem.save();
  res.send(result);
});

// [autho , isAdmin ]
router.delete("/:id", autho, async (req, res) => {
  const result = await Post.deleteOne({ _id: req.params.id });
  if (!result) {
    res.status(404).send("there is no post with this given id");
    return;
  }
  res.send(result);
});

module.exports = router;
