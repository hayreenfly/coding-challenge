const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");

const db = require("../../db/models/");
const Comment = db.comment;
const User = db.user;


// @route GET api/comment
// @desc GET all comments with pagination.
// @access Private

router.get("/", auth, async (req, res) => {
   const page = parseInt(req.query.page);
   const limit = parseInt(req.query.limit);

   const startIndex = (page - 1) * limit;
   const endIndex = page * limit;

   const results = {};

   let comments = await Comment.findAll({
      include: [{
         model: User,
         attributes: ["name"],
      }, ],
   });

   if (endIndex < comments.length) {
      results.next = {
         page: page + 1,
         limit: limit
      }
   }


   if (startIndex > 0) {
      results.previous = {
         page: page - 1,
         limit: limit
      }
   }

   results.results = comments.slice(startIndex, endIndex);

   res.json(results);
});

// @route POST api/comment/:postId
// @desc Post a comment on a post.
// @access Private

router.post("/:postId", auth, async (req, res) => {
   try {
      const newComment = {
         postId: req.params.postId,
         userId: req.user.id,
         comment: req.body.comment,
      }

      const comment = await Comment.create(newComment);

      res.json(comment);

   } catch (err) {
      console.error(err.message);
      res.status(500).json("Server Error");
   }
});


module.exports = router;