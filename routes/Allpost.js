const mongoose = require("mongoose");
const express = require("express");
const { Post } = require("../models/postmodel");
const router = express.Router();
require("express-async-errors");

// router.get("/", async (req, res) => {
//   try {
//     const posts = await Post.find();
//     res.send(posts);
//   } catch (ex) {
//     res.status(500).send("somethin failed")
//   }
// });


// router.get("/", async (req, res , next) => {
//   try {
//     const posts = await Post.find();
//     res.send(posts);
//   } catch (ex) {
//     next(ex)
//   }
// });

router.get("/", async (req, res) => {
    const posts = await Post.find().select("title description");
    res.send(posts);
});

module.exports = router;
