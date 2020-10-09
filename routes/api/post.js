const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");

const db = require("../../db/models/");
const { check, validationResult } = require("express-validator");
const Post = db.post;

// @route POST api/post
// @desc Create a post
// @access Private

router.post(
  "/",
  [
    auth,
    [
      check("title", "Title is required").not().isEmpty(),
      check("photo", "You must upload a photo.").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const newPost = {
        userId: req.user.id,
        title: req.body.title,
        description: req.body.description,
        photo: req.body.photo,
      };

      const post = await Post.create(newPost);
      res.json(post);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

module.exports = router;
